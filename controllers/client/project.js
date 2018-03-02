const {Config, Models, ajv, Helper} = App
const {orderNumber, filterNull} = Helper
const {Sequelize} = Models
const {ClientCompany, ClientUser, ClientRole, Project} = Sequelize
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
      guaranteeType: {
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
      }
    },
    additionalProperties: false,
    required: [
      'projectName',
      'projectNumber',
      'projectType',
      'guaranteeType',
      'projectSite',
      'tenderEndTime',
      'guaranteeMoney',
      'beneficiariesName',
      'maturityDate',
      'termValidity'
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

  data.companyId = ctx.auth.cid
  data.userId = ctx.auth.uid
  data.creator = user.nickname
  data.status = 1

  await Project
    .create(data)
    .then(project => {
      ctx.body = {
        errorCode: 0,
        data: project
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
      },
      projectNumber: {
        type: 'string'
      },
      search: {
        type: 'string'
      },
      searchField: {
        type: 'string'
      },
      isAgency: {
        type: 'number'
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

  let {
    page,
    limit,
    sort,
    isAgency,
    status,
    searchField,
    search,
    projectName,
    projectNumber
  } = data

  let where = filterNull({status, projectName, projectNumber, [searchField]: {[Op.like]: `%${search}%`}})

  if (isAgency) {
    where.companyId = ctx.auth.cid
  } else {
    where.userId = ctx.auth.uid
  }

  let findData = await Project.findAndCountAll({
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

  await Project.findOne({
    where: {
      id
    },
    include: [
      {
        all: true
      }
    ]
  }).then(project => {
    ctx.body = {
      errorCode: 0,
      data: project
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
      guaranteeType: {
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
      status: {
        type: 'number'
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

  console.log(data, 'xxxxxxxxxxxxxxxxxxxxxxxx')

  let findData = await Project.findById(id)

  if(!findData){
    ctx.body = {
      errorCode: 1000,
      msg: '工程不存在'
    }
    return
  }

  if(data.status === 2){
    let user = await ClientUser.findById(ctx.auth.uid)
    data.approver = user.nickname
    data.approvedTime = new Date()
  }

  await Project.update(data, {
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
  await Project.destroy({
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