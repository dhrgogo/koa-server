const jwt = require('jsonwebtoken')
const { Config,Models,Validator,FilterNull } = App
const { Sequelize,PG } = Models
const md5 = require('MD5')
const { Role } = PG
const { Op } = App.sequelize

exports.roleCreate = async ctx => {
	let json = ctx.request.body
	var { error,data } = Validator(json,{
		"role_name":{
			"type":String,
			"name":"角色名称",
			"allowNull":false
		},
		"roleDesc":{
			"type":String,
			"name":"角色描述",
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
	await Role.create(data).then(user => {
		ctx.body = {
			ErrCode:"0000",
			Result:"",
			msg:'创建成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.roleUpdate = async ctx => {
	let json = ctx.request.body
	let id = ctx.params.id
	let { error,data } = Validator(json,{
		"role_name":{
			"type":'String',
			"name":"角色名称",
			"allowNull":true
		},
		"roleDesc":{
			"type":'String',
			"name":"角色描述",
			"allowNull":true
		},
		"is_deleted":{
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
	await Role.update(data,{ where:{ id:id } }).then(user => {
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
};
exports.roleList = async ctx => {
	// let json = ctx.request.body
	// let id = ctx.params.id
	// var { error,data } = Validator(json,{
	// 	"phone":{
	// 		"type":'MobilePhone',
	// 		"name":"账号",
	// 		"allowNull":false
	// 	},
	// 	"name":{
	// 		"type":String,
	// 		"allowNull":true
	// 	},
	// 	"position":{       // 标识是商户还是员工
	// 		"type":String,
	// 		"allowNull":true
	// 	},
	// 	"english_name":{
	// 		"type":String,
	// 		"allowNull":true
	// 	},
	// 	"department":{
	// 		"type":String,
	// 		"allowNull":true
	// 	},
	// 	"sex":{
	// 		"type":Number,
	// 		"allowNull":true
	// 	},
	// 	"email":{
	// 		"type":String,
	// 		"allowNull":true
	// 	},
	// 	"user_img":{
	// 		"type":String,
	// 		"allowNull":true
	// 	}
	// })
	// if ( error ) {
	// 	ctx.body = {
	// 		ErrCode:1000,
	// 		ErrMsg:error
	// 	}
	// 	return;
	// }
	await Role.findAll({
		attributes:[ [ 'id','role_id' ],'role_name','roleDesc','is_deleted' ]
	}).then(role => {
		ctx.body = {
			ErrCode:'0000',
			Result:role
		}
		return
	})
}
exports.roleDelete = async ctx => {
	let json = ctx.request.body
	var { error,data } = Validator(json,{
		"page":{
			"type":Number,
			"name":"页码",
			"default":1,
			"allowNull":false
		},
		"limit":{
			"type":Number,
			"name":"每页的条数",
			"default":100,
		}
	})
	if ( error ) {
		ctx.body = {
			ErrCode:1000,
			ErrMsg:error
		}
		return;
	}
	await Role.findAll({
		attributes:[ [ 'id','role_id' ],'role_name','roleDesc','is_deleted' ]
	}).then(role => {
		ctx.body = {
			ErrCode:'0000',
			Result:role
		}
		return
	})
}
