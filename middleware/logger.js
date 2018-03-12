const log4js = require('log4js');
const logger = log4js.getLogger('cheese');
module.exports = async (ctx, next) => {
    let log = `${ctx.request.method} ${ctx.request.url} ${JSON.stringify(ctx.request.body)} ${ctx.response.status} ${ctx.request.querystring}`
    logger.level = 'info';
    logger.level = 'debug';
    logger.level = 'trace';
    logger.info(log);
    log4js.configure({
        appenders: {
            cheese: {
                type: 'file',
                filename: './logs/logger/cheese.log'
            }
        },
        categories: {
            default: {
                appenders: ['cheese'],
                level: 'error'
            }
        }
    });
    await next();
}
