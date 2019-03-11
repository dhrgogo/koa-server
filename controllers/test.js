"use strict"
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const md5 = require('MD5')
const {Config, Helper, Models, Validator} = App
const {bankKye, aesKey} = Config
const {Sequelize, PG} = Models
const {Admin} = PG
const {Op} = App.sequelize
exports.create = async ctx => {
    var json = {
        a: ['xx', 'kk'],
        b: [666, 1, 88],
    }
    let {error, data} = Validator(json, {
            b: [{"type": Number, "allowNull": false}, {"allowNull": false}],
        }
    )

    ctx.body = {
        errorCode: 0,
        msg: data
    }
}