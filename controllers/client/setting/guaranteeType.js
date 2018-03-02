const {Config, Models, ajv, Helper} = App
const {orderNumber, filterNull} = Helper
const {Sequelize} = Models
const {GuaranteeTypeFile} = Sequelize.Setting
const {Op} = App.sequelize

exports.create = async ctx => {
  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      file: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: [
      'name',
      'file'
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

  let {name, file} = data

  let findFile = await GuaranteeTypeFile.find({where: {
    name
  }})

  if(findFile){
    ctx.body = {
      errorCode: 1000,
      msg: '类型名重复'
    }
    return
  }

  await GuaranteeTypeFile.create(data).then(file => {
    ctx.body = {
      errorCode: 0,
      data: file
    }
  }).catch(err => {
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

  let {page, limit, sort} = data

  let findData = await GuaranteeTypeFile.findAndCountAll({
    offset: (page - 1) * limit,
    limit,
    order: [
      [sort, 'DESC']
    ]
  }).catch(err => {
    ctx.throw(err)
  })

  ctx.body = {
    errorCode: 0,
    data: findData.rows,
    totalCount: findData.count
  }
}

exports.details = async ctx => {
  const id = ctx.params.id

  await GuaranteeTypeFile.findById(id).then(file => {
    ctx.body = {
      errorCode: 0,
      data: file
    }
  })
}

exports.update = async ctx => {
  let data = ctx.request.body
  const id = ctx.params.id

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      file: {
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

  let {name, file} = data

  let findData = await GuaranteeTypeFile.findById(id)

  if(!findData){
    ctx.body = {
      errorCode: 1000,
      msg: '文件不存在'
    }
    return
  }

  await GuaranteeTypeFile.update(data, {
    where: {
      id
    }
  }).then(data => {
    if(data){
      ctx.body = {
        errorCode: 0,
        msg: '修改成功'
      }
    }else{
      ctx.body = {
        errorCode: 1000,
        msg: '修改失败'
      }
    }
  }).catch(err => {
    ctx.throw(err)
  })
}

exports.delete = async ctx => {
  const id = ctx.params.id

  await GuaranteeTypeFile.destroy({
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