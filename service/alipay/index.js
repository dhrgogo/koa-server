const path = require('path')
const Alipay = require('alipay-node-sdk')
const Config = App.Config.alipay

let alipay = new Alipay({
   appId: Config.appId,
   notifyUrl: Config.notifyUrl,
   rsaPrivate: path.resolve(__dirname, './keys/app_private.txt'),
   rsaPublic: path.resolve(__dirname, './keys/alipay_public_key_sha256.txt'),
   sandbox: false,
   signType: 'RSA2'
})

/**
   * 创建支付订单
   * @param {String} options.subject - 订单主题
   * @param {String} options.body - 订单描述
   * @param {Number} options.money - 订单金额
   * @param {ObjectID} options.id - 内部订单ID
   */
alipay.$create = async (ctx, options) => {

   // 生成客户端get参数
   return alipay.pay({
      subject: options.subject,
      body: options.body,
      outTradeId: options.id + '',
      timeout: '10m',
      amount: options.money,
      goodsType: '0',
      passbackParams: options.attach
   })

}

// 查询订单
alipay.$query = async (ctx) => {
   alipay.query({
      outTradeId: outTradeId
   }).then(function (ret) {
      console.log("***** ret.body=" + ret.body)
      // 签名校验
      var ok = alipay.signVerify(ret.json())
   })
}

// 退款
alipay.$refund = async (ctx) => {
   alipay.refund({
      outTradeId: outTradeId,
      operatorId: 'XX001',
      refundAmount: '2.01',
      refundReason: '退款'
   }).then(function (ret) {
      console.log("***** ret.body=" + ret.body)
   })
}

// 退款查询
alipay.$refundQuery = async (ctx) => {
   alipay.refundQuery({}).then(function (ret) {
      console.log("***** ret.body=" + ret.body)
   });
}

// 取消订单
alipay.$close = async (ctx) => {
   alipay.close({
      outTradeId: outTradeId
   }).then(function (ret) {
      console.log("***** ret.body=" + ret.body)
   })
}

module.exports = alipay