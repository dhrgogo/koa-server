const jwt = require('jsonwebtoken')
const {Config, Models, Helper, ajv, validate} = App
const {filterNull,} = Helper
const {Sequelize,PG} = Models
const {User} = PG
const {Op} = App.sequelize

exports.create = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
            mobile: {
                regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
            },
            telephone: {
                regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
            },
            name: {
                type: 'string'
            },
            english_name: {
                type: 'string'
            },
            department: {
                type: 'string'
            },
            order: {
                type: 'number'
            },
            email: {
                regexp: '/[\\w-.]+@[\\w-]+(.[\\w_-]+)+/'
            },
            position: {
                type: 'string'
            },
            gender: {
                type: 'number'
            },
            isleader: {
                type: 'string'
            },
            user_img: {
                type: 'string'
            },
            enable: {
                type: 'number'
            },
            extattr: {
                type: 'array'
            },
            department_id: {
                type: 'number',
                default: 2
            }
        },
        required: ['mobile', 'name', 'department_id']
    }
    const validate = ajv.validate(schema, data)
    // let thisTime = new Date().getTime() + Math.random().toString().slice(-4, -1)
    // data.customerNumber = thisTime
    // if (!validate) {
    //     ctx.body = {
    //         errorCode: 1000,
    //         msg: ajv.errors
    //     }
    //     return
    // }
    // await ClientCompany.findOne({where: {id: ctx.auth.cid}}).then(db => {
    //     data.creator = db.dataValues.contact
    //     data.clientId = db.dataValues.id
    // }).catch(err => {
    //     ctx.throw(err)
    // })
    console.log("data", data);
    await User.create(data).then(data => {
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
                default: 15
            },
            search: {
                type: 'string'
            },
            searchField: {
                type: 'string'
            },
            sort: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            department: {
                type: 'string'
            },
            mobile: {
                type: 'string'
            },
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
    let {page, limit, search, sort, searchField, name, department, mobile} = data
    let where = filterNull({
        [searchField]: {
            [Op.like]: `%${search}%`
        }
    })
    let searchs = {}
    if (name)
        searchs['name'] = name
    if (department)
        searchs['department'] = department
    if (mobile)
        searchs['mobile'] = mobile
    await User.findAndCount({
        where: search ? where : searchs,
        limit: limit,
        offset: (page - 1) * limit,
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
            mobile: {
                regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
            },
            telephone: {
                regexp: '/^1[3|4|5|7|8][0-9]{9}$/'
            },
            name: {
                type: 'string'
            },
            english_name: {
                type: 'string'
            },
            department: {
                type: 'string'
            },
            order: {
                type: 'number'
            },
            email: {
                regexp: '/[\\w-.]+@[\\w-]+(.[\\w_-]+)+/'
            },
            position: {
                type: 'string'
            },
            gender: {
                type: 'number'
            },
            isleader: {
                type: 'string'
            },
            user_img: {
                type: 'string'
            },
            enable: {
                type: 'number'
            },
            extattr: {
                type: 'array'
            },
            department_id: {
                type: 'number',
                default: 2
            }
        },
        required: ['mobile', 'name', 'department_id']
    }
    const validate = ajv.validate(schema, data)
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    await User.update(data, {where: {id: ctx.params.id}}).then(data => {
        ctx.body = {
            errorCode: 0,
            data
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
