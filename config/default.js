module.exports = {
   clientKey: '',//
   aesKey: '',//
   bankKye: '',//
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
      app_key: '',
      secret: ''
   },
   kuaidi100: {
      url: "",
      customer: '',
      key: '',
   },
}