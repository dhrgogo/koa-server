"use strict"

const { Router, Middleware: { bankAuth } } = App


const index = require('./index')

Router.post('bank/login', index.post_login)

Router.get('bank/time', index.get_time)

Router.get('client/time', index.get_time)

const guarantee = require('./guarantee')

Router.get('guarantee/:id', guarantee.details)  

// 银行管理员
const user = require('./user')

Router.get('bank/user', bankAuth, user.list)

Router.post('bank/user', bankAuth, user.create)

Router.put('bank/user/:id', bankAuth, user.update)

Router.delete('bank/user/:id', bankAuth, user.delete)


// 角色
const role = require('./role')

Router.get('bank/role', bankAuth, role.list)

Router.get('bank/role/:id', bankAuth, role.details)

Router.post('bank/role', bankAuth, role.create)

Router.put('bank/role/:id', bankAuth, role.update)

Router.delete('bank/role/:id', bankAuth, role.delete)


// 保函订单
const orders = require('./orders')

Router.get('bank/orders', bankAuth, orders.list)

Router.get('bank/orders/:id', bankAuth, orders.details)

Router.post('bank/orders', bankAuth, orders.create)

Router.put('bank/orders/:id', bankAuth, orders.update)

Router.delete('bank/orders/:id', bankAuth, orders.delete)


// 代理商
const client = require('./client')

Router.get('bank/client', bankAuth, client.list)

Router.post('bank/client', bankAuth, client.create)

Router.put('bank/client/:id', bankAuth, client.update)

Router.delete('bank/client/:id', bankAuth, client.delete)
