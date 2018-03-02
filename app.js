"use strict"

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const Router = require('koa-router')
const staticFile = require('koa-static')
const Lib = require('./lib/')
for (let name in Lib) {
   App[name] = Lib[name]
}

App.Router = new Router({ prefix: '/' })

App.Middleware = require('./middleware/')

App.Service = require('./service/')

App.Models.Sequelize = require('./models')

App.Controllers = require('./controllers')

let app = new Koa()

app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }))

app.use(cors())

app.use(logger())


app.use(App.Router.routes())

app.use(App.Router.allowedMethods())

app.use(staticFile(__dirname))// 静态资源访问

module.exports = app