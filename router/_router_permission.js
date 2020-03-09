"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const Permission = require('../controllers/admin/permission')

Router.post('permission', Permission.informationCreate)
Router.put('permission/:id', Permission.informationUpdate)
Router.get('permission', Permission.informationList)
Router.delete('permission', Permission.Delete)

// Router.post('admin/permission', Permission.userPermissionCreate)
// Router.put('admin/permission', Permission.userPermissionUpdate)
// Router.get('admin/permission', Permission.userPermissionList)

Router.post('role/permission', Permission.rolePermissionCreate)
Router.put('role/permission/:id', Permission.rolePermissionUpdate)
Router.get('role/permission', Permission.rolePermissionList)
