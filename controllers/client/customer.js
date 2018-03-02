const jwt = require('jsonwebtoken')
const {Config, Models, Helper, ajv, validate} = App
const {Sequelize} = Models
const {CustomerUser, ClientCompany} = Sequelize
const {Op} = App.sequelize

exports.create = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
            customerMobile: {
                regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
            },
            customerNumber: {
                type: 'string'
            },
            customerCity: {
                type: 'string'
            },
            customerAddress: {
                type: 'string'
            },
            customerMail: {
                type: 'string'
            },
            // purchaseNumber: {
            //     regexp: '/[\\w-.]+@[\\w-]+(.[\\w_-]+)+/'
            // },
            // guaranteeNumber: {
            //     type: 'number'
            // },
            customerName: {
                type: 'string'
            },
            companyNames: {
                type: 'array'
            }
        },
        required: ['customerMobile', 'customerCity', 'customerAddress', 'customerMail', 'customerName', 'companyNames']
    }
    const validate = ajv.validate(schema, data)
    let thisTime = new Date().getTime() + Math.random().toString().slice(-4, -1)
    data.customerNumber = thisTime
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    await ClientCompany.findOne({where: {id: ctx.auth.cid}}).then(db => {
        data.creator = db.dataValues.contact
        data.clientId = db.dataValues.id
    }).catch(err => {
        ctx.throw(err)
    })
    await CustomerUser.create(data).then(data => {
        ctx.body = {
            errorCode: 0,
            data
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
exports.list = async ctx => {
    let data = ctx.request.query
    const schema = {
        type: 'object',
        properties: {
            page: {
                type: 'number',
                default:1
            },
            limit: {
                type: 'number',
                default:10
            },
            search: {
                type: 'string'
            },
            searchField: {
                type: 'string'
            },
            sort: {
                type: 'string'
            }
        },
        required: data.searchField ? ['page', 'limit', 'search'] : []
    }
    const validate = ajv.validate(schema, data)
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    let {page, limit, search, sort, searchField} = data
    if (searchField){}
        let where = {
            [Op.or]: [
                {customerName: search},
                {customerNumber: search},
                {customerMobile: search}
            ]
        }
    await CustomerUser.findAndCount({
        where: search ? where : {},
        limit: limit||0,
        offset: ((page || 1) - 1) * limit,
        order: [
            [sort || 'createdAt', 'DESC']
        ]
    }).then(data => {
        ctx.body = {
            errorCode: 0,
            data: data.rows,
            totalCount: data.count,
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
exports.delete = async ctx => {
    const data = ctx.params.id
    const schema = {
        type: 'number',
        properties: {
            id: {
                type: 'number'
            }
        },
        required: ['id']
    }
    const validate = ajv.validate(schema, data)
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    let db = await CustomerUser.destroy(
        {
            where: {
                id: ctx.params.id
            },
            limit: 1
        }).catch(err => {
        ctx.throw(err)
    })
    if (!db) {
        ctx.body = {
            errorCode: 1000,
            msg: 'id不存在'
        }
        return
    }
    ctx.body = {
        errorCode: 0,
        data: db
    }
}
exports.details = async ctx => {
    const data = ctx.params.id
    const schema = {
        type: 'string',
        properties: {
            id: {
                type: 'string'
            }
        },
        required: ['id']
    }
    const validate = ajv.validate(schema, data)
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    let db = await CustomerUser.findOne({where: {id: ctx.params.id}}).catch(err => {
        ctx.throw(err)
    })
    if (!db) {
        ctx.body = {
            errorCode: 1000,
            msg: 'id不存在'
        }
        return
    }
    ctx.body = {
        errorCode: 0,
        data: db
    }
}
exports.update = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
            customerMobile: {
                regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
            },
            customerNumber: {
                type: 'string'
            },
            customerCity: {
                type: 'string'
            },
            customerAddress: {
                type: 'string'
            },
            customerMail: {
                regexp: '/[\\w-.]+@[\\w-]+(.[\\w_-]+)+/'
            },
            customerName: {
                type: 'string'
            },
            companyNames: {
                type: 'array'
            }
        },
        required: ['customerMobile', 'customerCity', 'customerAddress', 'customerMail', 'customerName', 'companyNames']
    }
    const validate = ajv.validate(schema, data)
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    await CustomerUser.update(data, {where: {id: ctx.params.id}}).then(data => {
        ctx.body = {
            errorCode: 0,
            data
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
