const jwt = require('jsonwebtoken')
const {Config, Models, Validater, FilterNull} = App
const {Sequelize, PG} = Models
const md5 = require('MD5')
const {User} = PG
const {Op} = App.sequelize

exports.post_login = async ctx => {
    let json = ctx.request.body
    var {error, data} = Validator(json, {
        "account": {
            "type": 'MobilePhone',
            "name": "账号",
            "allowNull": false
            
            // "type": String,
            // "name": "账号",
            // "reg": /^(\+?0?86\-?)?1[3456789]\d{9}$/,
            // "allowNull": false
        },
        "password": {
            "type": String,
            "name": "密码",
            // "minLength": 8,
            // "maxLength": 18,
            // "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": false
        },
        "typeOf": {
            "type": Number,
            "name": "账户权限",
            "allowNull": false,
            "in": [0, 1, 2, 3, 4]
        }
    })
    if (error) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
    data.type = data.typeOf
    let {account, password, type} = data
    let where = filterNull({
        account: account,
        type: type === 1 ? {[Op.in]: [1, 2, 3, 4]} : type
    })
    let user = await MerchantUser.find({
        where: where
    }).catch(err => {
        ctx.throw(err)
    })
    if (!user) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: '用户不存在'
        }
        return;
    }
    if (user.prohibit === 0) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: '您已被禁用'
        }
        return;
    }
    password = md5(`${password}${user.mixin}`).toUpperCase()
    if (password !== user.password) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: '密码错误'
        }
        return;
    }
    const time = 3600 * 24 * 60
    // const time = 60
    const random = Math.random().toString().slice(-5, -1)
    const encryptKey = CryptoJS.AES.encrypt(random, aesKey).toString()
    const token = jwt.sign({
        uid: user.id,
        username: user.name,
        key: encryptKey
    }, random + bankKye, {expiresIn: time})
    let db = {
        username: user.name,
        account: user.account,
        phone: user.phone,
        prohibit: user.prohibit,
        type: user.type,
        checkGrade: user.checkGrade,
        id: user.id,
        merchant_id: user.merchant_id,
    }
    db.token = token
    await MerchantUser.update({login_time: moment().format()}, {where: {account: user.account}})
    ctx.body = {
        ErrCode: "0000",
        Result: db,
        msg: '登录成功'
    }
    return
}
exports.informationCreate = async ctx => {
    
    let json = ctx.request.body
    let {error, data} = Validater(json, {
        "phone": {
            "type": 'MobilePhone',
            "name": "账号",
            "allowNull": false
        },
        "password": {
            "type": String,
            "name": "密码",
            "minLength": 8,
            "maxLength": 18,
            "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": false
        },
        "name": {
            "type": String,
            "allowNull": true
        },
        // "typeOf": {       // 标识是商户还是员工
        //     "type": Number,
        //     "name": "账户权限",
        //     "allowNull": false,
        //     "in": [0, 1, 2, 3, 4]
        // },
        // "svgCode": {
        //     "type": String
        // },
        // "CodeNum": {
        //     "type": String
        // },
        // "merchant_id": {
        //     "type": Number
        // }
    })
    if (error) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
    let {phone, password} = data
    console.log("=============", data)
    data.mixin = Math.random().toString().slice(-5, -1)
    data.password = md5(`${data.password}${data.mixin}`).toUpperCase()
    await User.create(data).then(user => {
        ctx.body = {
            ErrCode: "0000",
            Result: user,
            msg: '创建成功'
        }
    }).catch(err => {
        ctx.throw(err)
    })
};

exports.informationUpdate = async ctx => {
    let json = ctx.request.body
    var {error, data} = Validator(json, {
        "account": {
            "type": 'MobilePhone',
            "name": "账号",
            "allowNull": false
        },
        "password": {
            "type": String,
            "name": "密码",
            "minLength": 8,
            "maxLength": 18,
            "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": false
        },
        "name": {
            "type": String,
            "allowNull": true
        },
        "typeOf": {       // 标识是商户还是员工
            "type": Number,
            "allowNull": true,
            "in": [0, 1, 2]
        },
        "svgCode": {
            "type": String
        },
        "CodeNum": {
            "type": String
        },
        // "merchant_id": {
        //     "type": Number
        // }
    })
    if (error) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
    let {account, password, typeOf, merchant_id} = data
    if (!data.typeOf) {
        let cacheMsg = await Cache.findOne({account: account, svgCode: data.svgCode.toUpperCase()})
        if (!cacheMsg) {
            ctx.body = {
                ErrCode: 1000,
                ErrMsg: "输入的账号不正确"
            }
            return;
        }
        if (cacheMsg.svgCode.toUpperCase() !== data.svgCode.toUpperCase()) {
            ctx.body = {
                ErrCode: 1000,
                ErrMsg: "图片验证码错误"
            }
            return;
        }
        if (parseInt(cacheMsg.CodeNum) !== parseInt(data.CodeNum)) {
            ctx.body = {
                ErrCode: 1000,
                ErrMsg: "短信验证码错误"
            }
            return;
        }
    }
    let user = await MerchantUser.findOne({
        where: {
            account: data.account
        }
    })
    
    if (!user) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: '用户不存在'
        }
        return
    }
    data.mixin = Math.random().toString().slice(-5, -1)
    data.password = md5(`${data.password}${data.mixin}`).toUpperCase()
    data.originPassword = password
    data.phone = account
    // data.type = typeOf  // typeOf = 0 商户
    let created_Merchant
    await MerchantUser.update(data, {where: {account: account}}).then(user => {
        if (user[0]) {
            ctx.body = {
                ErrCode: "0000",
                Result: user,
                msg: '修改密码成功'
            }
        } else {
            ctx.body = {
                ErrCode: "1000",
                ErrMsg: user,
                msg: '修改密码失败'
            }
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
exports.informationList = async ctx => {
    let json = ctx.request.body
    var {error, data} = Validator(json, {
        "phone": {
            "type": 'MobilePhone',
            "name": "账号",
            "allowNull": false
        },
        "password": {
            "type": String,
            "name": "密码",
            "minLength": 8,
            "maxLength": 18,
            "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": false
        },
        "name": {
            "type": String,
            "allowNull": true
        },
        "typeOf": {       // 标识是商户还是员工
            "type": Number,
            "allowNull": true,
            "in": [0, 1, 2]
        },
        "svgCode": {
            "type": String
        },
        "CodeNum": {
            "type": String
        },
        // "merchant_id": {
        //     "type": Number
        // }
    })
    if (error) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
    // let {account, password, typeOf, merchant_id} = data
    // if (!data.typeOf) {
    //     let cacheMsg = await Cache.findOne({account: account, svgCode: data.svgCode.toUpperCase()})
    //     if (!cacheMsg) {
    //         ctx.body = {
    //             ErrCode: 1000,
    //             ErrMsg: "输入的账号不正确"
    //         }
    //         return;
    //     }
    //     if (cacheMsg.svgCode.toUpperCase() !== data.svgCode.toUpperCase()) {
    //         ctx.body = {
    //             ErrCode: 1000,
    //             ErrMsg: "图片验证码错误"
    //         }
    //         return;
    //     }
    //     if (parseInt(cacheMsg.CodeNum) !== parseInt(data.CodeNum)) {
    //         ctx.body = {
    //             ErrCode: 1000,
    //             ErrMsg: "短信验证码错误"
    //         }
    //         return;
    //     }
    // }
    // let user = await MerchantUser.findOne({
    //     where: {
    //         account: data.account
    //     }
    // })
    //
    // if (!user) {
    //     ctx.body = {
    //         ErrCode: 1000,
    //         ErrMsg: '用户不存在'
    //     }
    //     return
    // }
    // data.mixin = Math.random().toString().slice(-5, -1)
    // data.password = md5(`${data.password}${data.mixin}`).toUpperCase()
    // data.originPassword = password
    // data.phone = account
    // // data.type = typeOf  // typeOf = 0 商户
    // let created_Merchant
    // await MerchantUser.update(data, {where: {account: account}}).then(user => {
    //     if (user[0]) {
    //         ctx.body = {
    //             ErrCode: "0000",
    //             Result: user,
    //             msg: '修改密码成功'
    //         }
    //     } else {
    //         ctx.body = {
    //             ErrCode: "1000",
    //             ErrMsg: user,
    //             msg: '修改密码失败'
    //         }
    //     }
    // }).catch(err => {
    //     ctx.throw(err)
    // })
}

exports.userDelete = async ctx => {
    let json = ctx.params
    let {error, data} = Validator(json, {
        "id": {
            "type": Number,
            "name": "账户ID",
            "allowNull": false
        },
        "prohibit": {
            "type": Number,
            "default": "0"
        }
    })
    if (error) {
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
    let {prohibit, id} = data;
    await MerchantUser.update({prohibit: prohibit}, {
        where: {id: id}
    }).then(user => {
        if (user[0]) {
            ctx.body = {
                ErrCode: 0,
                Result: user,
                msg: '删除成功'
            }
        } else {
            ctx.body = {
                ErrCode: 0,
                ErrMsg: user,
                msg: '删除失败'
            }
        }
    }).catch(err => {
        ctx.throw(err)
    })
}
