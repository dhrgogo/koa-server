const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, ARRAY } = Sequelize
const ClientUser = require('./clientUser')
const ClientCompany = require('./clientCompany')


const Project = sequelize.define('project', {
  projectName: {type: STRING}, // 工程名称
  projectNumber: {type: STRING}, // 工程编号
  projectType: {type: INTEGER}, // 工程类型
  guaranteeType: {type: INTEGER}, // 保函类型
  projectSite: {type: ARRAY(STRING)}, // 工程地点
  tenderEndTime: {type: DATE}, // 截标日期
  guaranteeMoney: {type: DOUBLE}, // 担保金额
  beneficiariesName: {type: STRING}, // 受益人
  approver: {type: STRING}, // 审批人
  approvedTime: {type: DATE}, // 审批时间
  creator: {type: STRING}, // 创建人
  maturityDate: {type: DATE}, // 到期日期
  termValidity: {type: INTEGER}, // 有效期
  status: {type: INTEGER} // 状态， 0：已创建、1：待审核、2：已审核、-1：已驳回
})

ClientCompany.hasMany(Project, {as: 'project', foreignKey: 'companyId'})
Project.belongsTo(ClientCompany, {as: 'company', foreignKey: 'companyId'})

ClientUser.hasMany(Project, {as: 'project', foreignKey: 'userId'})
Project.belongsTo(ClientUser, {as: 'user', foreignKey: 'userId'})

module.exports = Project