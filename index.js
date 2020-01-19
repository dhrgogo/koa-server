"use strict"

let http = require('http')
let path = require('path')
let debug = require('debug')('demo:server')
let argv = require('argv-lx')

let PORT = process.env.PORT || 3817

let NODE_ENV = process.env.NODE_ENV || 'prd'

// 环境变量
if (NODE_ENV === 'prd') {
   NODE_ENV = 'production'
} else if (NODE_ENV === 'development') {
   NODE_ENV = 'development'
}
let parser = argv('PORT', 'NODE_ENV')
if (parser.PORT) {
   PORT = parser.PORT
}

if (parser.NODE_ENV) {
   NODE_ENV = parser.NODE_ENV
}

process.env.PORT = PORT

console.log(`-------------------------------------`)
console.log(`Load Config: ${NODE_ENV}  PORT: ${PORT}`)
console.log(`-------------------------------------`)

let filePath = path.resolve(__dirname, 'config', NODE_ENV)

// 全局变量
global.App = {
   Config: require('./config/default.js')
}

// 载入环境变量对应的配置文件
try {
   let envConfig = require(filePath)
   Object.assign(App.Config, envConfig)
} catch (err) {
   console.error('Cannot load config: [%s] %s', NODE_ENV, filePath)
   throw err
}


// app必须在载入配置文件后加载
let app = require('./app.js')

/**
 * Create HTTP server.
 */
let server = http.createServer(app.callback());

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
   if (error.syscall !== 'listen') {
      throw error;
   }

   var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

   // handle specific listen errors with friendly messages
   switch (error.code) {
      case 'EACCES':
         console.error(bind + ' requires elevated privileges');
         process.exit(1);
         break;
      case 'EADDRINUSE':
         console.error(bind + ' is already in use');
         process.exit(1);
         break;
      default:
         throw error;
   }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
   debug('Listening on ' + bind);
}
