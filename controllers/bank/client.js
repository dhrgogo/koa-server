const jwt = require('jsonwebtoken')
const md5 = require('MD5')
const {Config, Models, Helper, ajv} = App
const {filterNull} = Helper
const {Sequelize} = Models
const {ClientCompany, ClientUser, ClientRole} = Sequelize
const {Op} = App.sequelize

exports.create = async ctx => {

  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      companyName: {
        type: 'string'
      },
      contact: {
        type: 'string'
      },
      contactNumber: {
        type: 'string'
      },
      receiveAddress: {
        type: 'string'
      },
      mobilePhone: {
        type: 'string'
      },
      nickname: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      remark: {
        type: 'string',
        default: ''
      }
    },
    additionalProperties: false,
    required: [
      'companyName',
      'contact',
      'contactNumber',
      'receiveAddress',
      'mobilePhone',
      'nickname',
      'password'
    ]
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  let clientCompany = await ClientCompany.findOne({
    where: {
      companyName: data.companyName
    }
  })

  if (clientCompany) {
    ctx.body = {
      errorCode: 1000,
      msg: '公司已存在'
    }
    return
  }

  let companyData = {
    companyName: data.companyName,
    contact: data.contact,
    contactNumber: data.contactNumber,
    receiveAddress: data.receiveAddress
  }

  let userData = {
    mobilePhone: data.mobilePhone,
    nickname: data.nickname,
    password: data.password,
    remark: data.remark
  }

  userData.mixin = Math
    .random()
    .toString()
    .slice(-5, -1)
  userData.originPassword = userData.password
  userData.password = md5(`${userData.password}${userData.mixin}`).toUpperCase()
  userData.isAdmin = true

  await ClientUser.create({
    ...userData,
    company: companyData
  }, {
    include: [
      {
        model: ClientCompany,
        as: 'company'
      }
    ]
  }).then(data => {
    ctx.body = {
      errorCode: 0,
      data
    }
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
  const where = {
    // clientRoleId: null
  }

  await ClientUser.findAll({
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
  }).then(async data => {
    ctx.body = {
      errorCode: 0,
      data,
      totalCount: await ClientUser.count({where})
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
      mobilePhone: {
        type: 'string'
      },
      nickname: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      remark: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['mobilePhone', 'nickname', 'password']
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  await ClientUser
    .update(data, {where: {
      id
    }})
    .then(user => {
      ctx.body = {
        errorCode: 0,
        msg: '修改成功'
      }
    })
    .catch(err => {
      ctx.throw(err)
    })
}

exports.delete = async ctx => {
  const id = ctx.params.id

  if (!id) {
    ctx.body = {
      errorCode: 1000,
      msg: 'id不能为空'
    }
    return
  }

  let deleteUser = await ClientUser
    .destroy({
    where: {
      companyId: id
    }
  })
    .catch(err => {
      ctx.throw(err)
    })

    let deleteRole = await ClientRole
    .destroy({
    where: {
      companyId: id
    }
  })
    .catch(err => {
      ctx.throw(err)
    })

    let deleteCompany = await ClientCompany.destroy({where: {
      id
    }, limit: 1}).then(user => {
    if (user) {
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