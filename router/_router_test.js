"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const test = require('../controllers/test')
const User = require('../controllers/admin/user')

Router.post('vue-admin-template/admin/login/', test.getToken)
Router.get('vue-admin-template/admin/info/', test.userInfo)
Router.put('vue-admin-template/admin/info/', test.userInfo)
Router.post('vue-admin-template/admin/info/', test.userInfo)
Router.get('vue-admin-template/table/list', test.getlist)
// Router.get('vue-admin-template/admin/:id', test.transactionList)

Router.post('admin/login/', User.post_login)
Router.post('admin/info/', test.getlist)
Router.get('admin/info/', test.getlist)
Router.get('admin/list/', test.userlist)
Router.get('role/listAll/', test.rolelistAll)
Router.get('role/list/', test.rolelist)
Router.get('menu/treeList/', test.menuTreeList)

