const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN } = Sequelize

const Role = require('./role')

const Admin = sequelize.define('admin', {
    username: { type: STRING, unique: true },
    mobilePhone: { type: STRING }, // 联系电话
    checkGrade: { type: STRING }, // 昵称
    password: { type: STRING }, // md5加盐密码
    originPassword: { type: STRING }, // 原始密码
    mixin: { type: STRING } // 盐
})

Role.hasMany(Admin, {as: 'user', foreignKey: 'roleId'})
Admin.belongsTo(Role, {as: 'role', foreignKey: 'roleId'})

module.exports = Admin