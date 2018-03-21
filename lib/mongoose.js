const Config = App.Config

let mongoose = require('mongoose')

mongoose.Promise = Promise

// 启用调试模式
mongoose.set('debug', true)

mongoose
    .connect(Config.mongodb.connurl, {useMongoClient: true})
    .catch(err => {
        console.error('connect to ' + Config.mongodb.connurl + ' error!')
    })
// 全局schema注册回调
mongoose
    .plugin(schema => {
        // 全局添加createAt和updateAt字段 schema.add({   createAt: { type: Date, default:
        // Date.now() },   updateAt: { type: Date, default: Date.now() } }) 创建钩子
        // schema.pre('create', function (next) {    this.create({ 'createAt':
        // Date.now() })    console.log("create")    next() }) schema.pre('save',
        // function (next) {    this.update({ 'updateAt': Date.now() })    next() })
        // 更新钩子
        schema.pre('update', function (next) {
            this.update({
                'updateAt': Date.now()
            })
            next()
        })
        schema.pre('updateOne', function (next) {
            this.update({
                'updateAt': Date.now()
            })
            next()
        })

        schema.pre('findAndUpdate', function (next) {
            this.update({
                'updateAt': Date.now()
            })
            next()
        })

        schema.pre('findOneAndUpdate', function (next) {
            this.update({
                'updateAt': Date.now()
            })
            next()
        })
        // // 自定义方法 schema.statics = { 	fetch: function (cb) { 		return
        // this.find({}).sort('updateAt').exec(cb) 	} }

    })

module.exports = mongoose