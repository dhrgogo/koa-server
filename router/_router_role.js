"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const Role = require('../controllers/admin/role')

Router.post('role', Role.roleCreate)
Router.put('role/:id', Role.roleUpdate)
Router.get('role', Role.roleList)
Router.delete('role', Role.roleDelete)
