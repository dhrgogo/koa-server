const jwt = require( 'jsonwebtoken' )
const CryptoJS = require( 'crypto-js' )
const { Config: { aesKey, bankKye }, Models, Validator, FilterNull } = App
const { Sequelize, PG } = Models
const md5 = require( 'MD5' )
const { User, User_role, Role, Menu, Role_menu } = PG
const { Op } = App.sequelize
exports.postLogin = async ctx => {
    let json = ctx.request.body
    var { error, data } = Validator( json, {
        "phone": {
            "type": 'MobilePhone',
            "name": "手机号",
            "allowNull": false
        },
        "username": {
            "type": String,
            "name": "账号",
            // "allowNull":false
        },
        "password": {
            "type": String,
            "name": "密码",
            "minLength": 8,
            "maxLength": 18,
            "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": false
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { phone, password, type, username } = data
    let where = FilterNull( {
        phone: phone,
        name: username,
        // type: type === 1 ? {[Op.in]: [1, 2, 3, 4]} : type
    } )
    let user = await User.find( {
        where: where
    } ).catch( err => {
        ctx.throw( err )
    } )
    if (! user){
        ctx.body = {
            code: 200,
            message: "用户不存在",
            data: ""
        }
        return;
    }
    password = md5( `${ password }${ user.mixin }` ).toUpperCase()
    if (password !== user.password){
        ctx.body = {
            code: 500,
            message: "密码错误",
            data: ""
        }
        return;
    }
    const time = 3600 * 24 * 60
    // const time = 60
    const random = Math.random().toString().slice( - 5, - 1 )
    const encryptKey = CryptoJS.AES.encrypt( random, aesKey ).toString()
    const token = jwt.sign( {
        uid: user.id,
        username: user.name,
        key: encryptKey
    }, random + bankKye, { expiresIn: time } )
    let db = {
        id: user.id,
        username: user.name || "",
        phone: user.phone,
    }
    db.token = token
    ctx.body = {
        code: 200,
        message: "登录成功",
        data: db
    }
    return
}
exports.postInfo = async ctx => {
    let json = ctx.request.body
    let { error, data } = Validator( json, {
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
    } )
    if (error){
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
    let { phone, password } = data
    data.mixin = Math.random().toString().slice( - 5, - 1 )
    data.password = md5( `${ data.password }${ data.mixin }` ).toUpperCase()
    await User.create( data ).then( user => {
        ctx.body = {
            ErrCode: "0000",
            Result: "",
            msg: '创建成功'
        }
    } ).catch( err => {
        ctx.throw( err )
    } )
};
exports.adminInfo = async ctx => {
    console.log( "========", ctx.request.query )
    let json = ctx.query
    let { error, data } = Validator( json, {
        "phone": {
            "type": 'MobilePhone',
            "name": "手机号",
            // "allowNull": false
        },
        "user_id": {
            "type": Number,
            "name": "用户id",
            // "allowNull": false
        },
        "roleDesc": {
            "type": String,
            "name": "角色",
            // "allowNull": false
        },
        "role_id": {
            "type": Number,
            "name": "角色id",
            // "allowNull": false
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { phone, password, user_id, roleDesc, role_id } = data
    let where = FilterNull( {
        // phone: phone,
        // name: username,
        // user_id: user_id
        // roleDesc: roleDesc
        role_id: role_id
    } )
    await Role.findAll( {
        where: where,
        include: [{
            model: Menu,
            as: 'menu'
        }]
    } ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: db
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
    // await Menu.findAll( {
    //     where: where,
    //     include: [{
    //         model: Role,
    //         as: 'role'
    //     }]
    // } ).then( db => {
    //     ctx.body = {
    //         code: 200,
    //         message: "操作成功",
    //         data: db
    //     }
    //     return;
    // } ).catch( err => {
    //     ctx.throw( err )
    // } )
};
exports.adminRegister = async ctx => {
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "username": {
            "type": String,
            "name": "名称",
            "allowNull": false
        },
        "phone": {
            "type": 'MobilePhone',
            "name": "手机号",
            "allowNull": false
        },
        "email": {
            "type": 'Email',
            "name": "邮箱",
            // "allowNull": false
        },
        "password": {
            "type": String,
            "name": "密码",
            "minLength": 8,
            "maxLength": 18,
            "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": false
        },
        "is_deleted": {
            "type": Number,
            "default": 1
        },
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { username, phone, password, email, is_deleted } = data
    let db = FilterNull( {
        phone: phone,
        name: username,
        password: password,
        email: email,
        is_deleted: is_deleted
    } )
    await User.create( db ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: result
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
};
exports.adminUpdate = async ctx => {
    let json = ctx.request.body
    let id = ctx.params.id
    let { error, data } = Validator( json, {
        "username": {
            "type": String,
            "name": "名称",
            "allowNull": true
        },
        "phone": {
            "type": 'MobilePhone',
            "name": "手机号",
            "allowNull": true
        },
        "email": {
            "type": 'Email',
            "name": "邮箱",
            "allowNull": true
        },
        "password": {
            "type": String,
            "name": "密码",
            "minLength": 8,
            "maxLength": 18,
            "reg": /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
            "allowNull": true
        },
        "is_deleted": {
            "type": Number,
            "default": 1
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { username, phone, password, email, is_deleted } = data
    let db = FilterNull( {
        phone: phone,
        name: username,
        password: password,
        email: email,
        is_deleted: is_deleted
    } )
    await User.update( db, { where: { id: id } } ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: ""
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
};
exports.adminList = async ctx => {
    let json = ctx.request.query
    // let id = ctx.params.id
    var { error, data } = Validator( json, {
        "pageNum": {
            "type": Number,
            "name": "",
            "allowNull": true,
            "default": 1
        },
        "pageSize": {
            "type": Number,
            "allowNull": true,
            "default": 10
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { pageNum, pageSize } = data
    let where = FilterNull( {
        // phone: phone,
        // name: username,
    } )
    await User.findAndCountAll( {
        where,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
    } ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: db.count,
                totalPage: Math.ceil( db.count / pageSize ),
                list: db.rows
            }
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.rolelistAll = async ctx => {
    let json = ctx.request.body
    var { error, data } = Validator( json, {
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
    } )
    if (error){
        ctx.body = {
            ErrCode: 1000,
            ErrMsg: error
        }
        return;
    }
}
exports.menuTreeList = async ctx => {
    let json = ctx.request.query
    let { error, data } = Validator( json, {
        "phone": {
            "type": 'MobilePhone',
            "name": "账号",
            "allowNull": false
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { phone } = data
    let where = FilterNull( {
        phone: phone
    } )
    let roleUser = await User.find( {
        where,
        attributes: ['id', 'phone', 'name', 'sex', 'email', ['user_img', 'userImg']],
        include: [{
            model: Role,
            as: 'role',
            attributes: ['id', 'role_name', 'name']
        }]
    } )
    let roleIds = roleUser.role.length > 0 ? roleUser.role[0].id: ""
    if (! roleIds){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let roleMenu = await Role_menu.findAll( {
        where: { role_id: 1 },
        attributes: ['role_id', 'menu_id'],
        include: [{
            model: Menu,
            as: 'menu',
            attributes: ['id', 'menu', 'url', 'sort', 'style', 'parent_id']
        }]
    } )
    let menus = []
    roleMenu.forEach( obj => {
        menus.push( obj.menu )
    } )
    ctx.body = {
        code: 200,
        message: "操作成功",
        data: menus
    }
    return;
    
}
exports.menuList = async ctx => {
    let json = ctx.request.query
    // let id = ctx.params.id
    var { error, data } = Validator( json, {
        "pageNum": {
            "type": Number,
            "name": "",
            "allowNull": true,
            "default": 1
        },
        "pageSize": {
            "type": Number,
            "allowNull": true,
            "default": 10
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { pageNum, pageSize } = data
    let where = FilterNull( {
        // phone: phone,
        // name: username,
    } )
    await Menu.findAndCountAll( {
        where,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
    } ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: db.count,
                totalPage: Math.ceil( db.count / pageSize ),
                list: db.rows
            }
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.menuCreate = async ctx => {
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "menu": {
            "type": String,
            "name": "名称",
            "allowNull": false
        },
        "style": {
            "type": String,
            "name": "icon",
            "allowNull": false
        },
        "url": {
            "type": String,
            "name": "路径",
            "allowNull": true
        },
        "sort": {
            "type": Number,
            "name": "排序",
            "allowNull": false
        },
        "hidden": {
            "type": Number,
            "name": "是否显示标识",
            "default": 1
        },
        "parent_id": {
            "type": Number,
            "name": "父级id"
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { menu, style, url, sort, hidden, parent_id } = data
    let db = FilterNull( {
        menu: menu,
        style: style,
        url: url,
        sort: sort,
        parent_id: parent_id,
        hidden: hidden
    } )
    await Menu.create( db ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: ""
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.menuUpdate = async ctx => {
    let json = ctx.request.body
    let id = ctx.params.id
    let { error, data } = Validator( json, {
        "menu": {
            "type": String,
            "name": "名称",
            "allowNull": false
        },
        "style": {
            "type": String,
            "name": "icon",
            "allowNull": false
        },
        "url": {
            "type": String,
            "name": "路径",
            "allowNull": true
        },
        "sort": {
            "type": Number,
            "name": "排序",
            "allowNull": false
        },
        "hidden": {
            "type": Number,
            "name": "是否显示标识",
            "default": 1
        },
        "parent_id": {
            "type": Number,
            "name": "父级id"
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: "操作失败",
            data: ""
        }
        return;
    }
    let { menu, style, url, sort, hidden, parent_id } = data
    let db = FilterNull( {
        menu: menu,
        style: style,
        url: url,
        sort: sort,
        parent_id: parent_id,
        hidden: hidden
    } )
    await Menu.update( db, { where: { id: id } } ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: ""
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.roleList = async ctx => {
    let json = ctx.params
    let { error, data } = Validator( json, {
        "pageNum": {
            "type": Number,
            "name": "账户ID",
            "default": 1
        },
        "pageSize": {
            "type": Number,
            "default": 10
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { pageNum, pageSize } = data;
    let where = FilterNull( {
        // phone: phone,
        // name: username,
    } )
    await Role.findAndCountAll( {
        where,
        offset: (pageNum - 1) * pageSize,
        limit: pageSize
    } ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: db.count,
                totalPage: Math.ceil( db.count / pageSize ),
                list: db.rows
            }
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.roleCreate = async ctx => {
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "role_name": {
            "type": String,
            "name": "角色名称",
            "allowNull": false
        },
        "roleDesc": {
            "type": String,
            "allowNull": true
        },
        "is_deleted": {
            "type": Number,
            "default": 1
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { role_name, roleDesc, is_deleted } = data;
    let where = FilterNull( {
        role_name: role_name,
        roleDesc: roleDesc,
        is_deleted: is_deleted
    } )
    await Role.create( where ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: db
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.roleUpdate = async ctx => {
    let id = ctx.params.id
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "role_name": {
            "type": String,
            "name": "角色名称",
            "allowNull": false
        },
        "roleDesc": {
            "type": String,
            "allowNull": true
        },
        "is_deleted": {
            "type": Number,
            "default": 1
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { role_name, roleDesc, is_deleted } = data;
    let db = FilterNull( {
        role_name: role_name,
        roleDesc: roleDesc,
        is_deleted: is_deleted
    } )
    await Role.update( db, { where: { id: id } } ).then( db => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: db
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.userRoleCreate = async ctx => {
    let id = ctx.params.id
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "role_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": false
        },
        "user_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": false
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { role_id, user_id } = data;
    let db = FilterNull( {
        role_id: role_id,
        user_id: user_id
    } )
    await User_role.create( db ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: result
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.userRoleUpdate = async ctx => {
    let id = ctx.params.id
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "role_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": true
        },
        "user_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": true
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { role_id, user_id } = data;
    let db = FilterNull( {
        role_id: role_id,
        user_id: user_id
    } )
    await User_role.update( db, { where: { id: id } } ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: result
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}

exports.menuRoleCreate = async ctx => {
    let id = ctx.params.id
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "role_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": false
        },
        "menu_id": {
            "type": Number,
            "name": "菜单id",
            "allowNull": false
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { role_id, menu_id } = data;
    let db = FilterNull( {
        role_id: role_id,
        menu_id: menu_id
    } )
    await Role_menu.create( db ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: result
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
exports.menuRoleUpdate = async ctx => {
    let id = ctx.params.id
    let json = ctx.request.body
    let { error, data } = Validator( json, {
        "role_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": true
        },
        "menu_id": {
            "type": Number,
            "name": "角色id",
            "allowNull": true
        }
    } )
    if (error){
        ctx.body = {
            code: 201,
            message: error
        }
        return;
    }
    let { role_id, menu_id } = data;
    let db = FilterNull( {
        role_id: role_id,
        menu_id: menu_id
    } )
    await Role_menu.update( db, { where: { id: id } } ).then( result => {
        ctx.body = {
            code: 200,
            message: "操作成功",
            data: result
        }
        return;
    } ).catch( err => {
        ctx.throw( err )
    } )
}
