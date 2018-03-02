const {Config, Models, ajv, Helper, sequelize} = App
const {orderNumber, filterNull} = Helper
const {Sequelize} = Models
const {ClientUser, Guarantee, Order} = Sequelize
const {Op} = App.sequelize
exports.create = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
            checkForm: {
                type: 'array'
            },
            scanDocument: {
                type: 'array'
            },
            companyName: {
                type: 'string'
            },
            contact: {
                type: 'string'
            },
            contactNumber: {
                type: 'string'
            },
            addressee: {
                type: 'string'
            },
            receiveAddress: {
                type: 'string'
            }
        },
        additionalProperties: false,
        required: [
            'checkForm',
            'scanDocument',
            'companyName',
            'contact',
            'contactNumber',
            'receiveAddress'
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
    const year = (new Date()).getFullYear()
    const bankGuaranteeSelfAddId = await Order.count() + 1
    data.guaranteeSelfAddId = bankGuaranteeSelfAddId
    let {checkForm} = data
    // 根据当前保函订单数 保函数量 公司数量 生成保函编号
    for (let i = 0; i < checkForm.length; i++) {
        const id1 = '0'.repeat(6 - bankGuaranteeSelfAddId.toString().length) + bankGuaranteeSelfAddId.toString()
        const id2 = '0'.repeat(3 - (i + 1).toString().length) + (i + 1).toString()
        const currentguarantee = await Guarantee.findOne({where: {id: checkForm[i]}})
        let companys = currentguarantee.companys
        for (let j = 0; j < companys.length; j++) {
            const id3 = '0'.repeat(3 - (j + 1).toString().length) + (j + 1).toString()
            const guaranteeNumber = `LHTBG${year}${id1}${id2}-${id3}`
            companys[j].guaranteeNumber = guaranteeNumber
        }
        await Guarantee.update({"companys": companys}, {where: {id: checkForm[i]}})
    }
    let cid = ctx.auth.cid
    let uid = ctx.auth.uid
    // let cid = 1
    // let uid = 1
    try {
        let order = await Order.create({
            company: cid,
            clientUserId: uid,
            status: 0,
            orderNumber: orderNumber(),
            applyDate: new Date(),
            ...data,
        })
        await Guarantee.update({status: 2, guaranteeId: order.id}, {
            where: {
                userId: uid,
                id: {
                    [Op.in]: data.checkForm
                }
            }
        })
        ctx.body = {
            errorCode: 0,
            data: order,
        }
    } catch (e) {
        ctx.throw(e)
    }
    // 更新订单为已打包状态
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
    if (data.status === '0-9')
        data.status = {[Op.in]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
    let {page, limit, sort, search, searchField, status} = data
    let where = filterNull({
        status: status,
        [searchField]: {
            [Op.like]: `%${search}%`
        }
    })
    let order = await Order.findAndCountAll({
        where: searchField === 'nickname' ? {status: status} : where,
        order: [
            [sort || 'createdAt', 'DESC']
        ],
        // include: [{
        //     all: true
        // }],
        include: [{
            model: Guarantee,
            as: 'checkForm'
        }, {
            model: ClientUser,
            as: 'clientUser',
            where: searchField === 'nickname' ? {nickname: search} : {}
        }],
        limit: limit,
        offset: ((page || 1) - 1) * limit
    }).catch(err => {
        ctx.throw(err)
    })
    ctx.body = {
        errorCode: 0,
        data: order.rows,
        totalCount: order.count
    }
}

exports.update = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
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
            processDate: {
                type: 'string'
            }
        },
        additionalProperties: false,
        required: [
            'checkForm',
            'scanDocument',
            'status',
            'clientName',
            'contact',
            'contactNumber',
            'receiveAddress',
            'remarks',
            'processDate'
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
    let cid = ctx.auth.cid
    // let cid = 1
    await Order.update(data, {
        where: {
            id: ctx.params.id,
            company: cid
        }
    }).then(data => {
        if (parseInt(data.shift())) {
            ctx.body = {
                errorCode: 0,
                data: data,
            }
        } else {
            ctx.body = {
                errorCode: 1000,
                msg: '订单不存在'
            }
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
exports.back = async ctx => {
    let data = ctx.request.body
    const schema = {
        type: 'object',
        properties: {
            checkForm: {
                type: 'array'
            }
        },
        additionalProperties: false,
        required: [
            'checkForm'
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
    let cid = ctx.auth.cid
    // let cid = 1
    let trx = await sequelize.transaction();
    try {
        let firstUpdate = await Order.update({status: 0}, {
            where: {
                id: ctx.params.id,
                company: cid
            },
            transaction: trx
        })
        let nextUpdate = await Guarantee.update({status: -1}, {
            where: {
                id: {
                    [Op.in]: data.checkForm
                }
            },
            transaction: trx
        })
        if (nextUpdate.shift() === 0 || firstUpdate.shift() === 0) {
            await trx.rollback()
        } else {
            await trx.commit()
        }
    } catch (e) {
        await trx.rollback()
        ctx.throw(e)
    }
    ctx.body = {
        errorCode: 0,
        data: [],
    }
}
exports.details = async ctx => {
    let cid = ctx.auth.cid
    // let cid = 1
    await Order.findOne({
        where: {
            id: ctx.params.id,
            company: cid,
        },
        include: [
            {
                all: true
            }
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
exports.delete = async ctx => {
    await Order.destroy(
        {
            where: {
                id: ctx.params.id
            }
        }).then(data => {
        ctx.body = {
            errorCode: 0,
            data: data,
        }
    }).catch(err => {
        ctx.throw(err)
    })
}