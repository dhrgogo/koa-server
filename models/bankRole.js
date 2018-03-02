const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN } = Sequelize

let BankRole = sequelize.define('bankRole', {
    roleName: { type: STRING, unique: true }, // 角色名称
    authority: { type: JSON } // 权限表
})

module.exports = BankRole