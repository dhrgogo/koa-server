"use strict"

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const Router = require('koa-router')
const staticFile = require('koa-static')
// const log4js = require('log4js');
const logUtil = require('./utils/log_util');
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
app.use(async (ctx, next) => {
    const start = new Date();
    var ms;
    try {
        await next();
        ms = new Date() - start;
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        ms = new Date() - start;
        logUtil.logError(ctx, error, ms);
    }

});
app.use(App.Router.routes())

app.use(App.Router.allowedMethods())

app.use(staticFile(__dirname))// 静态资源访问

module.exports = app