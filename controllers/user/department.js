const jwt = require('jsonwebtoken')
const md5 = require('MD5')
const {Config, Models, Helper, ajv} = App
const {filterNull} = Helper
const {Sequelize} = Models
const {ClientCompany, Department} = Sequelize
const {Op} = App.sequelize

exports.create = async ctx => {

    let data = ctx.request.body

    const schema = {
        type: 'object',
        properties: {
            parentid: {
                type: 'number'
            },
            order: {
                type: 'number'
            },
            name: {
                type: 'string'
            }
        },
        additionalProperties: false,
        required: [
            'parentid',
            'name'
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

    let clientCompany = await Department.findOne({
        where: {
            parentid: data.parentid,
            name: data.name
        }
    }).catch(error => {
        ctx.body = {
            errorCode: 1000,
            msg: error
        }
    })

    if (clientCompany) {
        ctx.body = {
            errorCode: 1000,
            msg: '部门已存在'
        }
        return
    }
    //
    // let companyData = {
    //     companyName: data.companyName,
    //     contact: data.contact,
    //     contactNumber: data.contactNumber,
    //     receiveAddress: data.receiveAddress
    // }
    //
    // let userData = {
    //     mobilePhone: data.mobilePhone,
    //     nickname: data.nickname,
    //     password: data.password,
    //     remark: data.remark
    // }
    //
    // userData.mixin = Math
    //     .random()
    //     .toString()
    //     .slice(-5, -1)
    // userData.originPassword = userData.password
    // userData.password = md5(`${userData.password}${userData.mixin}`).toUpperCase()
    // userData.isAdmin = true

    // await ClientUser.create({
    //     ...userData,
    //     company: companyData
    // }, {
    //     include: [
    //         {
    //             model: ClientCompany,
    //             as: 'company'
    //         }
    //     ]
    // }).then(data => {
    //     ctx.body = {
    //         errorCode: 0,
    //         data
    //     }
    // })
    //
    let find = await Department.findOne({
        where: {
            id: data.parentid
        }
    }).catch(e => {
        ctx.body = {
            errorCode: 0,
            data: e
        }
    })
    await Department.create({parentid: find ? data.parentid : 0, name: data.name}).then(data => {
        ctx.body = {
            errorCode: 0,
            data: data
        }
    }).catch(e => {
        ctx.body = {
            errorCode: 1000,
            data: e
        }
    })

}
exports.test = async ctx => {
    ctx.body = {
        errorCode: 0
    }
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
                default: 100
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
    await Department.findAll({
        where,
        offset: (page - 1) * limit,
        limit,
        order: [
            [sort, 'DESC']
        ]
    }).then(async data => {
        // for (let i in data){
        getTree(8, data)

        // }
        console.log("----------------dat----", JSON.stringify(dat))
        // let a = GetData(0, menuArry)
        // console.log("a",menus)

        ctx.body = {
            errorCode: 0,
            data
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
var arr = []
var dat = [{
    id: 0,
    children: []
}]
arr.push(dat)

function getTree(id, array) {
    let childrenArr = children(id, array);
    console.log(childrenArr)
    for (let i in childrenArr) {
        tree(childrenArr[i], dat)
    }
}

function tree(childrenArr, dat) {
    for(let i in dat ){
        if (childrenArr.id === dat[i].id) {
            dat.push(childrenArr);
        } else if (dat.children && dat.children.length > 0) {
            tree(childrenArr, dat.children)
        } else {
            if(!dat.children){
                dat.children = []
            }
            dat.children.push(childrenArr);
        }
    }
}

function children(id, Array) {
    let department = [];
    for (let i in Array) {
        if (Array[i].parentid === id) {
            let db = {
                id: Array[i].id,
                parentid: Array[i].parentid,
                label: Array[i].name,
            }
            department.push(db)
        }
    }
    return department
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
        .update(data, {
            where: {
                id
            }
        })
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

    let deleteCompany = await ClientCompany.destroy({
        where: {
            id
        }, limit: 1
    }).then(user => {
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