const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const md5 = require('MD5')
const { Config, Helper, Models, ajv } = App
const { bankKye, aesKey } = Config
const { Validator } = Helper
const { Sequelize } = Models
const {BankRole, BankUser} = Sequelize
const {Op} = App.sequelize

exports.post_login = async ctx => {
  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: [
      'username',
      'password'
    ]
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

  let {username, password} = data

  let user = await BankUser.find({
    where: {
      username
    }
  }).catch(err => {
    ctx.throw(err)
  })

  if(!user){
    ctx.body = {
      errorCode: 1000,
      msg: '用户不存在'
    }
    return
  }

  password = md5(`${password}${user.mixin}`).toUpperCase()

  if(password !== user.password){
    ctx.body = {
      errorCode: 1000,
      msg: '密码错误'
    }
    return
  }

  const time = 3600 * 24 * 60
  const random = Math.random().toString().slice(-5, -1)
  const encryptKey = CryptoJS.AES.encrypt(random, aesKey).toString()
  const token = jwt.sign({uid: user.id, username: user.username, key: encryptKey}, random + bankKye, {expiresIn: time})
  
  ctx.body = {
    errorCode: 0,
    data: {
      token
    },
    msg: '登录成功'
  }
}

exports.get_time = async ctx => {
  ctx.body = {
    errorCode: 0,
    data: new Date()
  }
}