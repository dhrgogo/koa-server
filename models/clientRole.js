const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE } = Sequelize

const ClientCompany = require('./clientCompany')

const ClientRole = sequelize.define('clientRole', {
  roleName: { type: STRING, unique: true }, // 角色名称
  authority: { type: JSON } // 权限表
})

ClientCompany.hasMany(ClientRole, {as: 'role', foreignKey: 'companyId'})
ClientRole.belongsTo(ClientCompany, {as: 'company', foreignKey: 'companyId'})

module.exports = ClientRole