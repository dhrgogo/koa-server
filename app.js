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
App.Router = new Router({ prefix: '/dhr/' })

App.Middleware = require('./middleware/')

App.Validator = require('./utils/validate')

// App.Service = require('./service/')

App.Models = require('./models/')

// App.Controllers = require('./controllers')
App._router = require('./router')

let app = new Koa()

app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }))

app.use(cors())
// app.use(async (ctx, next) => {
//     const start = new Date();
//     var ms;
//     try {
//         await next();
//         ms = new Date() - start;
//         logUtil.logResponse(ctx, ms);
//     } catch (error) {
//         ms = new Date() - start;
//         logUtil.logError(ctx, error, ms);
//     }
//
// });
app.use(async(ctx, next) => {
    try {
        ctx.error = (code, message) => {
            if (typeof code === 'string') {
                message = code;
                code = 500;
            }
            ctx.throw(code || 500, message || '服务器错误');
        };
        await next();
    } catch (e) {
        let ErrCode = e.status || 500;
        let ErrMsg = e.message || '服务器错误';
        ctx.response.body = { ErrCode, ErrMsg };
        
    }
});
app.use(App.Router.routes())

app.use(App.Router.allowedMethods())

app.use(staticFile(__dirname))// 静态资源访问

module.exports = app
