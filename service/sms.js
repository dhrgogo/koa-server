const Redis = App.Redis
const { alidayu: Config } = App.Config
const Alidayu = require('alidayu-node-sdk')
const alidayu = new Alidayu(Config.app_key, Config.secret)


/**
   * 发送短信
   * @param {String} options.mobilePhone - 手机号
   * @param {String} options.name - 短信模板名称
   */
exports.send = async (ctx, options) => {

    // 发送前检查是否有发送记录
    let code = await Redis.getAsync(options.mobilePhone)
    if (code) {
        ctx.body = {
            errorCode: 1101,
            msg: '请勿重复发送短信'
        }
        return
    }

    // 生成4位数随机码，可能以0开头，需要用字符串格式
    code = Math.random().toString().slice(-5, -1)
    let response = await alidayu.smsSend({
        sms_free_sign_name: '标经理',
        sms_param: {
            code: code,
            product: '标经理',
        },
        rec_num: options.mobilePhone,
        sms_template_code: 'SMS_80115089',
    })

    if (response.error_response) {
        let error_response = response.error_response
        if (error_response.sub_code === 'isv.BUSINESS_LIMIT_CONTROL') {
            ctx.body = {
                errorCode: 1102,
                msg: "请勿频繁发送短信",
                errorData: response
            }
            return
        }
        ctx.body = {
            errorCode: 1100,
            msg: "验证码发送失败",
            errorData: response
        }
        return
    }

    response = response.alibaba_aliqin_fc_sms_num_send_response
    if (!response || !response.result || !response.result.success) {
        ctx.body = {
            errorCode: 1103,
            msg: "验证码发送失败",
            errorData: response
        }
        return
    }

    // 缓存手机号
    Redis.set(options.mobilePhone, code, 'EX', 100)
    return response.result

}