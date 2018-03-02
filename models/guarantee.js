const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, ARRAY } = Sequelize
const ClientUser = require('./clientUser')
const ClientCompany = require('./clientCompany')
const Project = require('./project')

const Guarantee = sequelize.define('guarantee', {
  projectName: {type: STRING}, // 工程名称
  orderNumber: {type: STRING}, // 订单编号
  projectNumber: {type: STRING}, // 工程编号
  projectType: {type: INTEGER}, // 工程类型
  projectSite: {type: ARRAY(STRING)}, // 工程地点
  companys: {type: ARRAY(JSONB)}, // 投标公司名称及对应保函编号
  tenderEndTime: {type: DATE}, // 截标日期
  guaranteeMoney: {type: DOUBLE}, // 担保金额
  beneficiariesName: {type: STRING}, // 受益人
  maturityDate: {type: DATE}, // 保函到期日期
  singlePrice: {type: DOUBLE}, // 单笔价格
  serviceCharge: {type: DOUBLE}, // 订单合计（手续费）
  contact: {type: STRING}, // 收件人
  contactNumber: {type: STRING}, // 联系电话
  receiveAddress: {type: STRING}, // 收件地址
  email: {type: STRING}, // 邮箱
  creator: {type: STRING}, // 创建人
  termValidity: {type: INTEGER}, // 有效期
  approvedTime: {type: DATE}, // 审批时间
  status: {type: INTEGER} // 订单状态 0:已创建、1:已申请、2:已完成、3:已出函、-1:驳回
})

ClientCompany.hasMany(Guarantee, {as: 'guarantee', foreignKey: 'companyId'})
Guarantee.belongsTo(ClientCompany, {as: 'company', foreignKey: 'companyId'})

ClientUser.hasMany(Guarantee, {as: 'guarantee', foreignKey: 'userId'})
Guarantee.belongsTo(ClientUser, {as: 'user', foreignKey: 'userId'})

module.exports = Guarantee