const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
const { Config:{ aesKey,bankKye },Models,Validator,FilterNull } = App
const { Sequelize,PG } = Models
const md5 = require('MD5')
const { User,User_role,Role, Permission } = PG
const { Op } = App.sequelize

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
exports.Delete = async ctx => {
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
exports.userPermissionCreate = async ctx => {
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
exports.userPermissionUpdate = async ctx => {
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
exports.userPermissionList = async ctx => {
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
	await User_role.findAll({
		where:where,
		include:[ {
			model:Role,
			as:'role'
		},{
			model:User,
			as:'user'
		} ],
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
