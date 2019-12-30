"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const test = require('../controllers/test')
const User = require('../controllers/user/user')

// /*管理员创建*/
// /*管理员登录*/
// Router.post('admin/user/', admin.create)
Router.post('user/login/', User.post_login)
Router.post('user', User.informationCreate)
Router.put('user/:id', User.informationUpdate)
Router.get('user', User.informationList)
Router.delete('user', User.userDelete)
//关联用户角色

Router.post('user/role', User.userRoleCreate)
Router.put('user/role', User.userRoleUpdate)
Router.get('user/role', User.userRoleList)
