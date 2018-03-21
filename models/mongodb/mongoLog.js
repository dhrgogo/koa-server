let Mongoose = App.Mongoose
let Schema = Mongoose.Schema

let version = new Schema({
    method: {type: String},// 请求方式
    status: {type: String},//  状态
    url: {type: String},   //  请求路由
    params: {type: String},// 请求数据
    time: {type: String}     //响应时间

})

module.exports = Mongoose.model('Version', version, 'version')