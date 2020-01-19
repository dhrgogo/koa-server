const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
const { Config:{ aesKey,bankKye },Models,Validator,FilterNull } = App
const { Sequelize,PG } = Models
const md5 = require('MD5')
const { User,User_role,Role } = PG
const { Op } = App.sequelize

exports.post_login = async ctx => {
	ctx.body = {
		ErrCode:"0000",
		Result:{
			id:1,
			username:"admin" || "",
			phone:"18503083260",
			token : "123"
		},
		msg:'登录成功'
	}
	return
	let json = ctx.request.body
	var { error,data } = Validator(json,{
		"phone":{
			"type":'MobilePhone',
			"name":"账号",
			// "allowNull":false
		},
		"username":{
			"type":String,
			"name":"账号",
			// "allowNull":false
		},
		"password":{
			"type":String,
			"name":"密码",
			"minLength":8,
			"maxLength":18,
			"reg":/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
			"allowNull":false
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	let { phone,password,type ,username} = data
	let where = FilterNull({
		phone:phone,
		name:username,
		// type: type === 1 ? {[Op.in]: [1, 2, 3, 4]} : type
	})
	let user = await User.find({
		where:where
	}).catch(err => {
		ctx.throw(err)
	})
	if ( !user ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:'用户不存在'
		}
		return;
	}
	password = md5(`${ password }${ user.mixin }`).toUpperCase()
	if ( password !== user.password ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:'密码错误'
		}
		return;
	}
	const time = 3600 * 24 * 60
	// const time = 60
	const random = Math.random().toString().slice(-5,-1)
	const encryptKey = CryptoJS.AES.encrypt(random,aesKey).toString()
	const token = jwt.sign({
		uid:user.id,
		username:user.name,
		key:encryptKey
	},random + bankKye,{ expiresIn:time })
	let db = {
		id:user.id,
		username:user.name || "",
		phone:user.phone,
	}
	db.token = token
	ctx.body = {
		ErrCode:"0000",
		Result:db,
		msg:'登录成功'
	}
	return
}
exports.informationCreate = async ctx => {
	
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"phone":{
			"type":'MobilePhone',
			"name":"账号",
			"allowNull":false
		},
		"password":{
			"type":String,
			"name":"密码",
			"minLength":8,
			"maxLength":18,
			"reg":/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
			"allowNull":false
		},
		"name":{
			"type":String,
			"allowNull":true
		},
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	let { phone,password } = data
	data.mixin = Math.random().toString().slice(-5,-1)
	data.password = md5(`${ data.password }${ data.mixin }`).toUpperCase()
	await User.create(data).then(user => {
		ctx.body = {
			ErrCode:"0000",
			Result:"",
			msg:'创建成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
};

exports.informationUpdate = async ctx => {
	let json = ctx.request.body
	let id = ctx.params.id
	var { error,data } = Validator(json,{
		"phone":{
			"type":'MobilePhone',
			"name":"账号",
			"allowNull":false
		},
		"name":{
			"type":String,
			"allowNull":true
		},
		"position":{       // 标识是商户还是员工
			"type":String,
			"allowNull":true
		},
		"english_name":{
			"type":String,
			"allowNull":true
		},
		"department":{
			"type":String,
			"allowNull":true
		},
		"sex":{
			"type":Number,
			"allowNull":true
		},
		"email":{
			"type":String,
			"allowNull":true
		},
		"user_img":{
			"type":String,
			"allowNull":true
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	await User.update(data,{ where:{ id:id } }).then(user => {
		if ( user[ 0 ] ) {
			ctx.body = {
				ErrCode:"0000",
				Result:"",
				msg:'修改成功'
			}
		} else {
			ctx.body = {
				ErrCode:"1000",
				ErrMsg:"",
				msg:'修改失败'
			}
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.informationList = async ctx => {
	let json = ctx.request.body
	var { error,data } = Validator(json,{
		"phone":{
			"type":'MobilePhone',
			"name":"账号",
			"allowNull":false
		},
		"password":{
			"type":String,
			"name":"密码",
			"minLength":8,
			"maxLength":18,
			"reg":/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/,
			"allowNull":false
		},
		"name":{
			"type":String,
			"allowNull":true
		},
		"typeOf":{       // 标识是商户还是员工
			"type":Number,
			"allowNull":true,
			"in":[ 0,1,2 ]
		},
		"svgCode":{
			"type":String
		},
		"CodeNum":{
			"type":String
		},
		// "merchant_id": {
		//     "type": Number
		// }
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
}

exports.userDelete = async ctx => {
	let json = ctx.params
	let { error,data } = Validator(json,{
		"id":{
			"type":Number,
			"name":"账户ID",
			"allowNull":false
		},
		"prohibit":{
			"type":Number,
			"default":"0"
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	let { prohibit,id } = data;
	await MerchantUser.update({ prohibit:prohibit },{
		where:{ id:id }
	}).then(user => {
		if ( user[ 0 ] ) {
			ctx.body = {
				ErrCode:0,
				Result:user,
				msg:'删除成功'
			}
		} else {
			ctx.body = {
				ErrCode:0,
				ErrMsg:user,
				msg:'删除失败'
			}
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.userRoleCreate = async ctx => {
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"user_id":{
			"type":Number,
			"name":"用户id",
			"allowNull":false
		},
		"role_id":{
			"type":Number,
			"name":"角色id",
			"allowNull":false
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	// let { prohibit,id } = data;
	await User_role.create(data).then(db => {
		ctx.body = {
			ErrCode:0,
			ErrMsg:"",
			msg:'创建成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.userRoleUpdate = async ctx => {
	let user_id = ctx.params.user_id
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"role_id":{
			"type":Number,
			"name":"角色id",
			"allowNull":false
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	
	let where = filterNull({
		user_id:user_id
	})
	await User_role.update(data,{ where:where }).then(db => {
		ctx.body = {
			ErrCode:0,
			ErrMsg:"",
			msg:'更新成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.userRoleList = async ctx => {
	let json = ctx.request.query
	let { error,data } = Validator(json,{
		"user_id":{
			"type":Number,
			"name":"用户的id",
			"allowNull":false
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	let { user_id } = data
	let where = {}
	if ( parseInt(user_id) > 0 ) {
		where = FilterNull({
			user_id:user_id
		})
	}
	await User.findAll({
		where:where,
		attributes:[ 'id','position','name','phone','department','sex','email','user_img' ],
		include:[ {
			model:Role,
			as:'role',
			attributes:[ 'id','role_name' ]
		}
		],
	}).then(db => {
		ctx.body = {
			ErrCode:0,
			ErrMsg:db,
			msg:''
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
