const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN } = Sequelize

const BankRole = require('./bankRole')

const BankUser = sequelize.define('bankUser', {
  username: { type: STRING, unique: true },
  mobilePhone: { type: STRING }, // 联系电话
  checkGrade: { type: STRING }, // 昵称
  password: { type: STRING }, // md5加盐密码
  originPassword: { type: STRING }, // 原始密码
  mixin: { type: STRING } // 盐
})

BankRole.hasMany(BankUser, {as: 'user', foreignKey: 'roleId'})
BankUser.belongsTo(BankRole, {as: 'role', foreignKey: 'roleId'})

module.exports = BankUser