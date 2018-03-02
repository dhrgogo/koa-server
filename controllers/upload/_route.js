const { Router, Middleware } = App
const { uploadFile, clientAuth, bankAuth } = Middleware

const upload = require('./upload')

// 代理商
Router.post('agency/upload', clientAuth, uploadFile('client').single('file'), upload.create)

// 银行
Router.post('bank/upload', bankAuth, uploadFile('bank').single('file'), upload.create)