module.exports = {
    appenders: {
        terminal: {
            type: 'stdout'
        },
        logger: {
            type: 'file',
            pattern: "-yyyy-MM-dd-hh.log",
            filename: './logs/logger/console.log',
        },
        errLog: {
            type: 'file',
            pattern: "-yyyy-MM-dd-hh.log",
            filename: './logs/errLog/errLog.log',
        }
    },
    categories: {
        default: {
            appenders: ['terminal', 'logger'],
            level: 'info'
        }
    }
}