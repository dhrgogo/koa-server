const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE} = Sequelize

const ClientCompany = sequelize.define('clientCompany', {
    method: {type: STRING},// 请求方式
    status: {type: STRING},//  状态
    url: {type: STRING},   //  请求路由
    params: {type: STRING},// 请求数据
    time: {type: STRING}     //响应时间
})
//tree：{parentId:"XXX",name:""}
module.exports = ClientCompany