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

// app.use(cors())
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
// app.use(async (ctx, next) => {
//     console.log("ctx.request.header.origin：", ctx.request.header.origin)
//     console.log("ctx.origin：", ctx.origin)
//     // let reg = RegExp(/prettycode/);
//     // ctx.request.header.origin.match(reg)
//     if (ctx.request.header.origin && ctx.request.header.origin.match(reg)) {
//         await next();
//     } else {
//         if (ctx.request.header.origin !== ctx.origin) {
//             ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
//             ctx.set('Access-Control-Allow-Credentials', true);
//             ctx.set('Access-Control-Allow-Headers', 'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, Authorization,authorization');
//         }
//         await next();
//     }
// });
// app.use(async (ctx, next) => {
//     if (ctx.method === 'OPTIONS') {
//         ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
//         ctx.set('Access-Control-Max-Age', 3600 * 24);
//         ctx.body = '';
//     }
//     await next();
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
        let ErrCode = e.status || e.ErrCode || 500;
        let ErrMsg = e.message || e.ErrMsg || '服务器错误';
        ctx.response.body = { ErrCode, ErrMsg };
    }
});
app.use(App.Router.routes())

app.use(App.Router.allowedMethods())

app.use(staticFile(__dirname))// 静态资源访问

module.exports = app
