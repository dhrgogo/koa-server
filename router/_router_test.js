"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const test = require('../controllers/test')

Router.post('vue-admin-template/user/login/', test.getToken)
Router.get('vue-admin-template/user/info/', test.userInfo)
Router.put('vue-admin-template/user/info/', test.userInfo)
Router.post('vue-admin-template/user/info/', test.userInfo)
Router.get('vue-admin-template/table/list', test.getlist)
Router.get('vue-admin-template/user/:id', test.transactionList)

