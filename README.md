# koa_server 
# 使用 koa2 搭建的一个完整的框架
﻿Koa 2.0 优点：首先，借助 promise 和 generator 的能力，丢掉了 callback，完美解决异步组合问题和异步异常捕获问题，其次koa 把 express 中内置的 router、view 等功能都移除了，使得框架本身更轻量化。
﻿基于这些优点就自己搭建一个koa后台api开发框架。

### Install

```
github:[https://github.com/dhrgogo/koa-server.git](https://github.com/dhrgogo/koa-server)

```
```
npm i

```

## 中间件

在app/middleware目录下创建中间件文件，框架自动载入并进行类型检测。

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中

## 源码说明
### 项目目录说明
```
.
|-- config
|   |-- development.js          // 测试开发配置
|   |-- localhost.js            // 开发环境配置
|   |-- production.js           // 部署环境配置
|-- controller                  // 逻辑模块
|   |-- user                    // 带有权限管理的user
|        |-- _route.js          // 路由
|   |-- index.js                // 引入路由
|-- lib                         // 公共组件
|   |-- mongoose.js              // MongoDB 链接配置
|   |-- sequelize.js             // PG 链接配置
|   |-- index.js                 // 引入导出配置
|-- logs                         // 日志
|-- middleware                   // 中间件
|   |-- clientAuth.js            // token 验证模块
|   |-- index.js                 // 引入导出
|-- models                       // 模型定义模块
|   |-- mongodb                  // MongoDB 模型
|   |-- sequelize                // PG 模型
|   |-- index.js                 // 引入导出
|-- utils                        // 日志配置
|   |-- log_util.js              // 日志配置文件
|-- app.js                       // 入口文件
|-- gulpfile.js                  // gulp 自动化部署配置
|-- index.js                     // server配置载入app.js
|-- README.md                    // 项目说明
|-- package.json                 // 配置项目相关信息，通过执行 npm init 命令创建
.
```
