const {Config, Models, ajv, Helper} = App
const {filterNull} = Helper
const {Sequelize} = Models
const {BankRole} = Sequelize
const {Op} = App.sequelize

exports.create = async ctx => {
  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      roleName: {
        type: 'string'
      },
      authority: {
        type: 'object'
      }
    },
    additionalProperties: false,
    required: ['roleName', 'authority']
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  let {roleName, authority} = data

  let findRole = await BankRole.find({where: {
    roleName
  }})

  if(findRole){
    ctx.body = {
      errorCode: 1000,
      msg: '角色名已存在'
    }
    return
  }

  await BankRole.create(data).then(role => {
    ctx.body = {
      errorCode: 0,
      data: role
    }
  }).catch(err => {
    ctx.throw
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
    
  }

  let bankRoleList = await BankRole.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit,
    order: [
      [sort, 'DESC']
    ]
  })

  ctx.body = {
    errorCode: 0,
    data: bankRoleList.rows,
    totalCount: bankRoleList.count
  }
}

exports.details = async ctx => {
  await BankRole.findById(ctx.params.id).then(role => {
    ctx.body = {
      errorCode: 0,
      data: role
    }
  }).catch(err => {
    ctx.throw(err)
  })
}

exports.update = async ctx =>{
  let data = ctx.request.body 
  const id = ctx.params.id

  const schema = {
    type: 'object',
    properties: {
      roleName: {
        type: 'string'
      },
      authority: {
        type: 'object'
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

  let {roleName, authority} = data

  let findRole = await BankRole.find({where:{
    roleName
  }})

  if(findRole){
    ctx.body = {
      errorCode: 1000,
      msg: '角色名已存在'
    }
    return
  }

  await BankRole.update(data, {
    where: {
      id
    }
  }).then(data => {
    if(data){
      ctx.body = {
        errorCode: 0,
        msg: '修改成功'
      }
    }else {
      ctx.body = {
        errorCode: 0,
        msg: '修改失败'
      }
    }
  }).catch(err => {
    ctx.throw(err)
  })
}

exports.delete = async ctx => {
  const id = ctx.params.id

  await BankRole.destroy({
    where: {
      id
    },
    limit: 1
  }).then(data => {
    if(data){
      ctx.body = {
        errorCode: 0,
        msg: '删除成功'
      }
    }else {
      ctx.body = {
        errorCode: 1000,
        msg: '删除失败'
      }
    }
  }).catch(err => {
    ctx.throw(err)
  })
}