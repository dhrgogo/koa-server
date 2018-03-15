const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE} = Sequelize

const ClientCompany = sequelize.define('clientCompany', {
    companyName: {type: STRING},// 公司名称
    contact: {type: STRING},// 联系人
    contactNumber: {type: STRING},// 联系电话
    receiveAddress: {type: STRING},// 收件地址
    parentId: {type: STRING},//父部门的id
    name: {type: STRING}//部门名称
})
//tree：{parentId:"XXX",name:""}
module.exports = ClientCompany