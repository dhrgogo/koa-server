const log4js = require('log4js');
const logger = log4js.getLogger('cheese');
// const logger = log4js.getLogger();
module.exports = async (ctx, next) => {
    // let log = `${ctx.request.method} ${ctx.request.url}${ctx.body}${ctx.status}${ctx.message}${ctx.query}`
    let log = `${ctx.request.method} ${ctx.request.url} ${JSON.stringify(ctx.request.body)} ${ctx.response.status} ${ctx.request.querystring}`
    logger.level = 'info';
    logger.level = 'debug';
    logger.level = 'trace';
    logger.info(log);
    // logger.debug("Some debug messages");
    // logger.trace('Entering cheese testing');
    // logger.debug('Got cheese.');
    // logger.info('Cheese is Gouda.');
    // logger.warn('Cheese is quite smelly.');
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
