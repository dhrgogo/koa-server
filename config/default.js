module.exports = {
   clientKey: 'HYH*&!943',// 客户签名密钥
   aesKey: 'HYH*&!943',// 客户签名中AES加、解密密钥
   bankKye: 'HYH*&!943',// 银行签名密钥
   redis: {
      port: 6379,
      ip: "127.0.0.1",
      auth_pass: "biaojingli",
      options: {}
   },
   accessControl: {
      allowOrigin: '*',
      allowMethods: 'PUT, POST, GET, DELETE, OPTIONS',
      allowHeaders: 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
   },
   alidayu: {
      app_key: '23765821',
      secret: '69690c1c72c90b154f4c4bcbd2d51152'
   },
   kuaidi100: {
      url: "http://poll.kuaidi100.com/poll/query.do",
      customer: '7CC3D2B5F0F0C571C87DE4883F69E100',
      key: 'nvishHgK6281',
   },
}