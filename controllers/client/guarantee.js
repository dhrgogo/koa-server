const {Config, Models, ajv, Helper} = App
const {orderNumber, filterNull} = Helper
const {Sequelize} = Models
const {ClientUser, Guarantee } = Sequelize
const {Op} = App.sequelize

exports.create = async ctx => {
  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      projectName: {
        type: 'string'
      },
      projectNumber: {
        type: 'string'
      },
      projectType: {
        type: 'number'
      },
      projectSite: {
        type: 'array'
      },
      tenderEndTime: {
        type: 'string'
      },
      guaranteeMoney: {
        type: 'number'
      },
      beneficiariesName: {
        type: 'string'
      },
      maturityDate: {
        type: 'string'
      },
      termValidity: {
        type: 'number'
      },
      singlePrice: {
        type: 'number'
      },
      serviceCharge: {
        type: 'number'
      },
      contact: {
        type: 'string'
      },
      contactNumber: {
        regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
      },
      receiveAddress: {
        type: 'string'
      },
      email: {
        regexp: '/[\\w-.]+@[\\w-]+(.[\\w_-]+)+/'
      },
      companys: {
        type: 'array',
        items:  {
          type: 'object',
          properties: {
            name: {
              type  : 'string'
            }
          },
          required: [
            'name'
          ]
        }
      }
    },
    additionalProperties: false,
    required: [
      'projectName',
      'projectNumber',
      'projectType',
      'projectSite',
      'tenderEndTime',
      'guaranteeMoney',
      'beneficiariesName',
      'maturityDate',
      'termValidity',
      'singlePrice',
      'serviceCharge',
      'contact',
      'contactNumber',
      'receiveAddress',
      'email',
      'companys'
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

  let user = await ClientUser.findById(ctx.auth.uid)

  data.userId = ctx.auth.uid
  data.creater = user.nickname
  data.orderNumber = orderNumber()
  data.status = 0

  await Guarantee.create(data).then(guarantee => {
    ctx.body = {
      errorCode: 0,
      data: guarantee
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
      },
      search: {
        type: 'string'
      },
      searchField: {
        type: 'string'
      },
      status: {
        type: 'number'
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

  let {page, limit, sort, search, searchField, status} = data

  let where = filterNull({
    status,
    [searchField]: {
      [Op.like]: `%${search}%`
    }
  })

  let findData = await Guarantee.findAndCountAll({
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
    data: findData.rows,
    totalCount: findData.count
  }
}

exports.details = async ctx => {
  const id = ctx.params.id

  await Guarantee.findOne({
    where: {
      id
    },
    include: [
      {all: true}
    ]
  }).then(guarantee => {
    ctx.body = {
      errorCode: 0,
      data: guarantee
    }
  })
}

exports.update = async ctx => {
  let data = ctx.request.body 
  const id = ctx.params.id
  
  const schema = {
    type: 'object',
    properties: {
      projectName: {
        type: 'string'
      },
      projectNumber: {
        type: 'string'
      },
      projectType: {
        type: 'number'
      },
      projectSite: {
        type: 'array'
      },
      tenderEndTime: {
        type: 'string'
      },
      guaranteeMoney: {
        type: 'number'
      },
      beneficiariesName: {
        type: 'string'
      },
      maturityDate: {
        type: 'string'
      },
      termValidity: {
        type: 'number'
      },
      singlePrice: {
        type: 'number'
      },
      serviceCharge: {
        type: 'number'
      },
      contact: {
        type: 'string'
      },
      contactNumber: {
        regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
      },
      receiveAddress: {
        type: 'string'
      },
      email: {
        regexp: '/[\\w-.]+@[\\w-]+(.[\\w_-]+)+/'
      },
      companys: {
        type: 'array',
        items:  {
          type: 'object',
          properties: {
            name: {
              type  : 'string'
            }
          },
          required: [
            'name'
          ]
        }
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

  let order = await Guarantee.findById(id)

  if(!order){
    ctx.body = {
      errorCode: 1000,
      msg: '订单不存在'
    }
  }

  await Guarantee.update(data, {
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

  await Guarantee.destroy({
    where:{
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