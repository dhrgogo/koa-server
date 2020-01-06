const { Config:{ aesKey,bankKye },Models,Validator,FilterNull } = App
const { Sequelize,PG } = Models
const md5 = require('MD5')
const { User,User_role,Role,Menu,Role_permission,Menu } = PG
const { Op } = App.sequelize

exports.informationCreate = async ctx => {
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"menu":{
			"type":String,
			"name":"名称",
			"allowNull":false
		},
		"url":{
			"type":String,
			"name":"路径",
			"allowNull":false
		},
		"style":{
			"type":String,
			"name":"样式",
			"allowNull":true
		},
		"sort":{
			"type":Number,
			"allowNull":true
		},
		"role_id":{
			"type":Number,
			"default":0,
			"allowNull":true
		},
		"parent_id":{
			"type":Number,
			"default":0,
			"allowNull":true
		},
		"permission_id":{
			"type":Number,
			"default":0,
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
	// let { parent_id, permission_name, permissionDesc } = data
	// let where = FilterNull({
	// 	parent_id:parent_id,
	// 	permission_name:permission_name,
	// 	permissionDesc:permissionDesc,
	// 	// type: type === 1 ? {[Op.in]: [1, 2, 3, 4]} : type
	// })
	await Menu.create(data).then(db => {
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
	let id = ctx.params.id
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"menu":{
			"type":String,
			"name":"名称",
			"allowNull":false
		},
		"url":{
			"type":String,
			"name":"路径",
			"allowNull":false
		},
		"style":{
			"type":String,
			"name":"样式",
			"allowNull":true
		},
		"sort":{
			"type":Number,
			"allowNull":true
		},
		"role_id":{
			"type":Number,
			"default":0,
			"allowNull":true
		},
		"parent_id":{
			"type":Number,
			"default":0,
			"allowNull":true
		},
		"permission_id":{
			"type":Number,
			"default":0,
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
	// let { parent_id,permission_name,permissionDesc } = data
	let where = FilterNull({
		id:id
	})
	await Menu.update({ data , where: where}).then(db => {
		ctx.body = {
			ErrCode:"0000",
			Result:"",
			msg:'更新成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.informationList = async ctx => {
	await Menu.findAll({}).then(db => {
		ctx.body = {
			ErrCode:'0000',
			ErrMsg:db
		}
	}).catch(e => {
		ctx.throw(e)
	})
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

exports.rolePermissionCreate = async ctx => {
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"permission_id":{
			"type":Number,
			"name":"权限id",
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
	await Role_permission.create(data).then(db => {
		ctx.body = {
			ErrCode:0,
			ErrMsg:"",
			msg:'创建成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.rolePermissionUpdate = async ctx => {
	let id = ctx.params.id
	let json = ctx.request.body
	let { error,data } = Validator(json,{
		"role_id":{
			"type":Number,
			"name":"角色id",
			"allowNull":true
		},
		"permission_id":{
			"type":Number,
			"name":"权限id",
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
	
	let where = filterNull({
		id:id
	})
	await Role_permission.update(data,{ where:where }).then(db => {
		ctx.body = {
			ErrCode:0,
			ErrMsg:"",
			msg:'更新成功'
		}
	}).catch(err => {
		ctx.throw(err)
	})
}
exports.rolePermissionList = async ctx => {
	let json = ctx.request.query
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
	let { role_id } = data
	let where = {}
	if ( parseInt(role_id) > 0 ) {
		where = FilterNull({
			role_id:role_id
		})
	}
	await Role_permission.findAll({
		where:where,
		include:[ {
			model:Role,
			as:'role',
			attributes:{ exclude:[ 'createdAt' ] }
			// through: {
			// 	attributes: ['createdAt']
			// }
		},{
			model:Menu,
			as:'permission',
			attributes:{ exclude:[ 'createdAt' ] }
			// through: {
			// 	attributes: ['createdAt', 'startedAt'],
			// }
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
