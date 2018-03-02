"use strict"
const {Router, Middleware: {bankAuth, roleAuth}} = App

const admin = require('./admin')

/*管理员创建*/
/*管理员登录*/
Router.post('admin/user/', admin.create)
Router.post('user/login/', admin.login)
Router.get('user/info/',bankAuth, admin.info)
Router.post('user/logout/', admin.logout)

// 部门操作
const department = require('./department')

Router.get('department/test',department.test)
Router.get('department/list',department.list)

Router.post('department/create', bankAuth, department.create)

// Router.put('department/update/:id', bankAuth, department.update)
//
// Router.delete('department/delete/:id', bankAuth, department.delete)

//用户
const user = require('./user.js')

Router.get('user/list',bankAuth, user.list)

Router.get('user/details/:id', bankAuth, user.details)

Router.post('user/create',bankAuth, user.create)

Router.put('user/update/:id', user.update)

Router.delete('user/delete/:id', bankAuth, user.delete)

