const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN } = Sequelize

const ClientCompany = require('./clientCompany')
const ClientRole = require('./clientRole')

const ClientUser = sequelize.define('clientUser', {
  mobilePhone: { type: STRING, unique: true }, // 联系电话
  nickname: { type: STRING }, // 昵称
  password: { type: STRING }, // md5加盐密码
  originPassword: { type: STRING }, // 原始密码
  mixin: { type: STRING }, // 盐
  isAdmin: { type: BOOLEAN }, // 是否是超级管理员
})

ClientCompany.hasMany(ClientUser, {as: 'users', foreignKey: 'companyId'})
ClientUser.belongsTo(ClientCompany, {as: 'company', foreignKey: 'companyId'})

ClientRole.hasMany(ClientUser, {as: 'user', foreignKey: 'roleId'})
ClientUser.belongsTo(ClientRole, {as: 'role', foreignKey: 'roleId'})


module.exports = ClientUser