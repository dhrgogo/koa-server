const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize

const customerUser = sequelize.define('customerUser', {
    customerNumber: {type: STRING, primaryKey: true},//编号
    customerMobile: {type: STRING}, // 使用手机号
    customerCity: {type: STRING},//地址
    customerAddress: {type: STRING},//联系地址
    customerMail: {type: STRING},//邮箱
    purchaseNumber: {type: INTEGER, defaultValue: 0}, //购买数量
    guaranteeNumber: {type: DOUBLE, defaultValue: 0}, //担保金额
    customerName: {type: STRING},// 用户名
    companyNames: {type: ARRAY(TEXT)},// 公司名
    creator: {type: STRING},// 创建人
    clientId: {type: STRING},//代理商id
    id: {type: INTEGER, autoIncrement: true}
})
module.exports = customerUser