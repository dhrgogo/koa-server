"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const test = require('../controllers/test')
const Admin = require('../controllers/admin/user')

// /*管理员创建*/
// /*管理员登录*/
// Router.post('admin/admin/', admin.create)
// Router.post('admin/login/', User.post_login)
// Router.post('admin/login/', User.post_login)
// Router.post('user', User.informationCreate)
// Router.put('admin/:id', User.informationUpdate)
// Router.get('user', User.informationList)
// Router.delete('user', User.userDelete)
// //关联用户角色
//
// Router.post('admin/role', User.userRoleCreate)
// Router.put('admin/role', User.userRoleUpdate)
// Router.get('admin/role', User.userRoleList)

Router.post('admin/login/', Admin.postLogin)
Router.post('admin/info/', Admin.postInfo)
// 管理员信息
Router.get('admin/info/', Admin.adminInfo)
Router.post('admin/register/', Admin.adminRegister)
Router.post('/admin/update/:id', Admin.adminUpdate)
// 管理员列表
Router.get('admin/list/', Admin.adminList)
// Router.post('admin/list/', Admin.adminList)
// Router.post('admin/list/', Admin.adminList)
// 菜单列表
Router.get('menu/treeList/', Admin.menuTreeList)
Router.post('menu/create/', Admin.menuCreate)
Router.post('menu/update/:id', Admin.menuUpdate)
// 角色列表
Router.get('role/list/', Admin.rolelist)

Router.get('role/listAll/', Admin.rolelistAll)
