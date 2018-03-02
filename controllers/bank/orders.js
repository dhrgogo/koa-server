const {Config, Models, ajv, Helper, sequelize} = App
const {orderNumber, filterNull} = Helper
const {Sequelize} = Models
// const sequelize = require('../../../lib/sequelize').sequelize
const {ClientUser, Guarantee, Order} = Sequelize
const {Op} = App.sequelize
exports.create = async ctx => {

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
                type: 'string'
            },
            status: {
                type: 'string'
            },
            createdAt: {
                type: 'string'
            },
            searchField: {
                type: 'string'
            },
            search: {
                type: 'string'
            }
        },
        additionalProperties: false,
        required: [
            'page',
            'limit',
            'status'
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
    let {page, limit, sort, search, searchField, status} = data
    let where = filterNull({
        status: status,
        [searchField]: {
            [Op.like]: `%${search}%`
        }
    })
    let order = await Order.findAndCount({
        where: searchField === 'createUser' ? {status: status} : where,
        order: [
            [sort || 'createdAt', 'DESC']
        ],
        // include: [{
        //     all: true
        // }],
        include: [{
            model: Guarantee,
            as: 'checkForm',
            where: searchField === 'createUser' ? {creator: search} : {}
        }, {
            model: ClientUser,
            as: 'clientUser',
        }],
        limit: limit,
        offset: ((page || 1) - 1) * limit,
    }).catch(err => {
        ctx.throw(err)
    })
    ctx.body = {
        errorCode: 0,
        data: order.rows,
        totalCount: order.count
    }
}
exports.details = async ctx => {
    await Order.findOne({
        where: {
            id: ctx.params.id
        },
        include: [
            {all: true}
        ]
    }).then(data => {
        ctx.body = {
            errorCode: 0,
            data: data
        }
    }).catch(err => {
        ctx.throw(err)
    })
}

exports.update = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
            createPeople: {
                type: 'string'
            },
            checkForm: {
                type: 'array'
            },
            scanDocument: {
                type: 'array'
            },
            status: {
                type: 'number',
                default: 0
            },
            clientName: {
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
            remarks: {
                type: 'string'
            },
            rejectRemarks: {
                type: 'string'
            },
            checkFormId: {
                type: 'array'
            }
        },
        additionalProperties: false,
        required: data.status === 10 ? ['checkFormId'] : []
    }
    const validate = ajv.validate(schema, data)
    if (!validate) {
        ctx.body = {
            errorCode: 1000,
            msg: ajv.errors
        }
        return
    }
    let order = await Order.findOne({where: {id: ctx.params.id}}).catch(err => {
        ctx.throw(err)
    })
    if (!order) {
        ctx.body = {
            errorCode: 1000,
            msg: '订单不存在'
        }
        return
    }
    let {status} = data
    return sequelize.transaction((t) => {
        // 要确保所有的查询链都有return返回
        if (status === 10) {
            return Order.update(data, {
                where: {
                    id: ctx.params.id
                }
            }, {transaction: t}).then((order) => {
                const approvedTime = new Date()
                return Guarantee.update({status: 3, approvedTime}, {
                    where: {
                        id: {
                            [Op.in]: data.checkFormId
                        }
                    }
                }, {transaction: t});
            });
        } else {
            return Order.update(data, {
                where: {
                    id: ctx.params.id
                }
            }, {transaction: t});
        }
    }).then(result => {
        // Transaction 会自动提交
        // result 是事务回调中使用promise链中执行结果
        ctx.body = {
            errorCode: 0,
            data: result,
        }
    }).catch(err => {
        // Transaction 会自动回滚
        // err 是事务回调中使用promise链中的异常结果
        ctx.throw(err)
    });

}

exports.delete = async ctx => {
    await Order.destroy({where: {id: ctx.params.id}})
        .then(data => {
            ctx.body = {
                errorCode: 0,
                data: data,
            }
        }).catch(err => {
            ctx.throw(err)
        })
}