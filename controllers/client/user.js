const jwt = require('jsonwebtoken')
const md5 = require('MD5')
const {Config, Models, ajv, Helper} = App
const {filterNull} = Helper
const {Sequelize} = Models
const {ClientCompany, ClientUser, ClientRole} = Sequelize
const {Op} = App.sequelize

exports.create = async ctx => {
  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      mobilePhone: {
        regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
      },
      password: {
        type: 'string'
      },
      nickname: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['mobilePhone', 'password', 'nickname']
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  let {mobilePhone, password} = data

  let findUser = await ClientUser.findOne({where: {
      mobilePhone
    }})

  if (findUser) {
    ctx.body = {
      errorCode: 1000,
      msg: '用户已注册'
    }
    return
  }

  data.companyId = ctx.auth.cid

  data.mixin = Math
    .random()
    .toString()
    .slice(-5, -1)
  data.password = md5(`${password}${data.mixin}`).toUpperCase()
  data.originPassword = password

  await ClientUser
    .create(data)
    .then(user => {
      ctx.body = {
        errorCode: 0,
        data: user,
        msg: '注册成功'
      }
    })
    .catch(err => {
      ctx.throw(err)
    })
}

exports.list = async ctx => {
  let data = ctx.query

  filterNull(data)

  const schema = {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        default: 1
      },
      limit: {
        type: 'number',
        default: 10
      },
      sort: {
        type: 'string',
        default: 'createdAt'
      }
    },
    additionalProperties: false,
    required: ['page', 'limit', 'sort']
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  const {page, limit, sort} = data

  let where = {
    companyId: ctx.auth.cid
  }

  let users =  await ClientUser.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit,
    order: [
      [sort, 'DESC']
    ],
    include: [
      {
        all: true
      }
    ]
  }).catch(err => {
    ctx.throw(err)
  })

  ctx.body = {
    errorCode: 0,
    data: users.rows,
    totalCount: users.count
  }
}

exports.details = async ctx => {
  await ClientUser.findOne({
    where: {
      id: ctx.params.id
    },
    include: [
      {
        all: true
      }
    ]
  }).then(user => {
    ctx.body = {
      errorCode: 0,
      data: user
    }
  }).catch(err => {
    ctx.throw(err)
  })
}

exports.update = async ctx => {
  let data = ctx.request.body
  const id = ctx.params.id

  if (!id) {
    ctx.body = {
      errorCode: 1000,
      msg: 'id不能为空'
    }
    return
  }

  const schema = {
    type: 'object',
    properties: {
      password: {
        type: 'string'
      },
      roleId: {
        type: 'number'
      },
      newPassword: {
        type: 'string'
      },
      rePassword: {
        type: 'string'
      }
    },
    additionalProperties: false
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  let {password, newPassword, rePassword, roleId} = data

  let user = await ClientUser.findById(id)

  if(!user){
    ctx.body = {
      errorCode: 0,
      msg: '用户不存在'
    }
    return
  }

  if(password){
    if(md5(`${password}${user.mixin}`).toUpperCase() === user.password && password === rePassword){
      data.password = md5(`${newPassword}${user.mixin}`).toUpperCase()
      data.originPassword = newPassword
    } else {
      ctx.body = {
        errorCode: 1000,
        msg: '输入错误'
      }
      return
    }
  }

  if (roleId) {
    let role = await ClientRole.findById(data.roleId)
    if (role) {
      await ClientUser
      .update(data, {where: {
        id
      }})
      .then(data => {
        if(data){
          ctx.body = {
            errorCode: 0,
            msg: '修改成功'
          }
        }else {
          ctx.body = {
            errorCode: 1000,
            msg: '修改失败'
          }
        }
      })
      .catch(err => {
        ctx.throw(err)
      })
    } else {
      ctx.body = {
        errorCode: 1000,
        msg: '角色不存在'
      }
    }
  } else {
    await ClientUser
    .update(data, {where: {
      id
    }})
    .then(data => {
      if(data){
        ctx.body = {
          errorCode: 0,
          msg: '修改成功'
        }
      }else {
        ctx.body = {
          errorCode: 1000,
          msg: '修改失败'
        }
      }
    })
    .catch(err => {
      ctx.throw(err)
    })
  }
}

exports.delete = async ctx => {
  const id = ctx.params.id

  let user = await ClientUser.findById(id)

  if (user.isAdmin) {
    ctx.body = {
      errorCode: 1000,
      msg: '禁止删除超级管理员'
    }
    return
  } else {
    await ClientUser.destroy({where: {
        id
      }, limit: 1}).then(data => {
      if (data) {
        ctx.body = {
          errorCode: 0,
          msg: '删除成功'
        }
      } else {
        ctx.body = {
          errorCode: 1000,
          msg: '删除失败'
        }
      }
    }).catch(err => {
      ctx.throw(err)
    })
  }

}