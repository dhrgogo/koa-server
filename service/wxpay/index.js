const WXPay = require('weixin-pay')
const Config = App.Config.wechatApp
const fs = require('fs')
const path = require('path')

let wxpay = WXPay({
   appid: Config.appid,
   mch_id: Config.mch_id,
   partner_key: Config.mch_key,
   pfx: fs.readFileSync(path.resolve(__dirname, './cert/apiclient_cert.p12'))
})


/**
   * 创建支付订单
   * @param {String} options.body - 订单描述
   * @param {Number} options.money - 订单金额
   * @param {ObjectID} options.id - 内部订单ID
   */
wxpay.$create = async (ctx, options) => {

   // 从微信服务端获取预支付订
   let response = await new Promise((resolve, reject) => {

      wxpay.createUnifiedOrder({
         body: options.body,
         out_trade_no: options.id + '',
         total_fee: options.money * 100,
         spbill_create_ip: '',
         notify_url: Config.notifyUrl,
         trade_type: 'APP',
         attach: options.attach
      }, function (err, result) {
         if (err) {
            reject(err)
         } else {
            resolve(result)
         }
      })
   })

   if (!response) {
      ctx.body = {
         errorCode: 1000,
         msg: "微信服务端无响应"
      }
      return
   }

   if (response.return_code === 'FAIL' || response.result_code === 'FAIL') {
      ctx.body = {
         errorCode: 1000,
         errorData: response
      }
      return
   }

   // 响应验签
   if (response.sign !== wxpay.sign(response)) {
      ctx.body = {
         errorCode: 1000,
         msg: "签名无效"
      }
      return
   }

   // 返回客户端SDK接口参数
   let sdkParam = {
      appid: Config.appid,
      partnerid: Config.mch_id,
      prepayid: response.prepay_id,
      package: 'Sign=WXPay',
      noncestr: Math.random().toString().substr(2, 10),
      timestamp: Date.now()
   }

   // 请求加签
   sdkParam.sign = wxpay.sign(sdkParam)

   return sdkParam

}

// 退款
wxpay.$refund = async (ctx, options) => {

   let params = {
      appid: Config.appid,
      mch_id: Config.mch_id,
      op_user_id: Config.mch_id,
      out_refund_no: options.orderId,
      total_fee: '1', //原支付金额
      refund_fee: '1', //退款金额
      out_trade_no: options.orderId
   }

   let result = await new Promise((resolve, reject) => {
      wxpay.refund(params, function (err, result) {
         resolve(result)
         reject(err)
      })
   })

}

// 查询订单
wxpay.$query = async (ctx, options) => {

   let orderId = ctx.request.body.orderId
   if (!orderId) {
      ctx.body = {
         errorCode: 1000,
         msg: '商户订单号不能为空'
      }
      return
   }

   // 本地查询
   let order = await Wallet.findById(orderId)
   if (order) {
      ctx.body = {
         errorCode: 0,
         data: order
      }
   }
   // 微信服务端查询
   else {
      order = await new Promise((resolve, reject) => {
         wxpay.queryOrder({ out_trade_no: orderId }, function (err, order) {
            resolve(order)
            reject(err)
         });
      })

      ctx.body = {
         errorCode: 0,
         data: order
      }
   }

}

// 取消订单
wxpay.$close = async (ctx, options) => {

   let orderId = ctx.request.body.orderId

   let result = await new Promise((resolve, reject) => {
      wxpay.closeOrder({ out_trade_no: orderId }, function (err, result) {
         resolve(result)
      })
   })

   if (result) {
      if (result.return_code === 'SUCCESS') {
         // 更新订单状态为关闭
         data = await Wallet.update({ _id: orderId }, {
            status: 3,
            updateAt: Date.now()
         })
         ctx.body = {
            errorCode: 0,
            data: result
         }
      } else {
         ctx.body = {
            errorCode: 1000,
            msg: result.return_msg
         }
      }
   } else {
      ctx.body = {
         errorCode: 1000,
         msg: '请求超时'
      }
   }

}

module.exports = wxpay