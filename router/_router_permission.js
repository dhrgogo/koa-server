"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const Permission = require('../controllers/user/permission')

// /*管理员创建*/
Router.post('permission', Permission.informationCreate)
Router.put('permission/:id', Permission.informationUpdate)
Router.get('permission', Permission.informationList)
Router.delete('permission', Permission.Delete)
//关联用户角色

Router.post('user/permission', Permission.userPermissionCreate)
Router.put('user/permission', Permission.userPermissionUpdate)
Router.get('user/permission', Permission.userPermissionList)
