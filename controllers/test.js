"use strict"
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const md5 = require('MD5')
const {Config, Helper, Models, Validator} = App
const {bankKye, aesKey} = Config
const {Sequelize, PG} = Models
const {Admin} = PG
const {Op} = App.sequelize
exports.getToken = async ctx => {
    ctx.body = {
        "code": 20000,
        "data": {
            "token": "admin-token"
        }
    }
}
exports.userInfo = async ctx => {
    ctx.body = {
        code:20000,
        data:{
            roles:[ "admin" ],
            introduction:"I am a super administrator",
            avatar:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            name:"Super Admin"
        }
    }
}
exports.getlist = async ctx => {
    ctx.body = {
        code: 20000,
        data: {
            "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            "introduction": "I am a super administrator",
            "name": "Super Admin",
            "roles": ["admin"]
        }
    }
}
exports.transactionList = async ctx => {
    ctx.body = {
        code: 20000,
        data: {
            items: [
                {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }, {
                    order_no: "7421dddB-51cc-C469-1385-C6ebcef0e46D",
                    price: 6021,
                    status: "pending",
                    timestamp: 1183916679954,
                    username: "Paul Lee"
                }],
            total: 20
        }
    }
}
