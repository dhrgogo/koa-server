const log4js = require('log4js');
const log_config = require('../config/configLog');
log4js.configure(log_config);
const logger = log4js.getLogger('dhr');
logger.info('test');
logger.error('test');
var logUtil = {};
 //封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        logger.error(formatError(ctx, error, resTime));
    }
};
//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        logger.info(formatRes(ctx, resTime));
    }
};
//格式化响应日志
var formatRes = function (ctx, resTime) {
    let logStr = new String()
    logStr += formatReqLog(ctx.request, resTime);
    logStr += "status:" + ctx.status+' ';
    logStr += "body:" + JSON.stringify(ctx.body)+' ';
    // logger.info(logStr);
    return logStr;
}

 //格式化错误日志
var formatError = function (ctx, err, resTime) {
    let logStr = new String();
    logStr += formatReqLog(ctx.request, resTime)+' ';
    logStr += "err name:" + err.name+' ';
    logStr += "err message:" + err.message+' ';
    logStr += "err stack: " + err.stack+' ';
    logger.error(logStr);
    return logStr;
};

 //格式化请求日志
var formatReqLog = function (req, resTime) {
    var logStr = new String();
    var method = req.method;
    logStr += "method:" + method +' ';
    logStr += "originalUrl:" + req.originalUrl + ' ';
    if (method === 'GET') {
        logStr += "query:" + JSON.stringify(req.query) + ' ';
    } else {
        logStr += "body:" + JSON.stringify(req.body)+' ';
    }
    //服务器响应时间
    logStr += "time: " + resTime +'ms'+"\n";
    logger.info(logStr);
    return logStr;
}
module.exports = logUtil;
