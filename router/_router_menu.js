"use strict"
const {Router, Middleware: {bankAuth, roleAuth, logger}} = App

const Menu = require('../controllers/admin/menu')

Router.post('menu', Menu.informationCreate)
Router.put('menu/:id', Menu.informationUpdate)
Router.get('menu', Menu.informationList)
Router.delete('menu', Menu.Delete)
