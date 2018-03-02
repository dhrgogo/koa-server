const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const md5 = require('MD5')
const {Config, Models, ajv} = App
const {clientKey, aesKey, fileHost} = Config
const {Sequelize} = Models
const {ClientCompany, ClientUser} = Sequelize
const {Op} = App.sequelize

exports.post_login = async ctx => {
  let data = ctx.request.body

  const schema = {
    type: 'object',
    properties: {
      mobilePhone: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['mobilePhone', 'password']
  }

  const validate = ajv.validate(schema, data)

  if (!validate) {
    ctx.body = {
      errorCode: 1000,
      msg: ajv.errors
    }
    return
  }

    let {mobilePhone, password} = data

  let user = await ClientUser.findOne({where: {
      mobilePhone
    }})

  if (!user) {
    ctx.body = {
      errorCode: 1000,
      msg: '用户不存在'
    }
    return
  }

  let md5Password = md5(`${password}${user.mixin}`).toUpperCase()
  if(md5Password !== user.password){
    ctx.body = {
      errorCode: 1000,
      msg: '密码错误'
    }
    return
  }

  const time = 3600 * 24 * 60
  const random = Math.random().toString().slice()
  const encryptKey = CryptoJS.AES.encrypt(random, aesKey).toString() 
  const token = jwt.sign({uid: user.id, cid: user.companyId, key: encryptKey}, random + clientKey, {expiresIn: time})

  ctx.body = {
    errorCode: 0,
    data: {
      token
    },
    msg: '登录成功'
  }
}

exports.get_company = async ctx => {
  console.log(ctx.auth.cid)
  await ClientCompany.findById(ctx.auth.cid).then(data => {
    ctx.body = {
      errorCode: 0,
      data
    }
  })
}

exports.getAuthority = async ctx => {
  const id = ctx.auth.uid

  await ClientUser.findOne({
    where: {
      id
    },
    include: [
      {all: true}
    ]
  }).then(user => {
    ctx.body = {
      errorCode: 0,
      data: user
    }
  }).catch(err => {
    ctx.throw(err)
  })
}