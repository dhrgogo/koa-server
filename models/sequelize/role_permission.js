const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
// 角色权限关联表
const Permission = require('./permission')
const Role = require('./role')
const Role_permission = sequelize.define('Role_permission', {
    role_id: {type: INTEGER},//-------------角色ID
    permission_id: {type: INTEGER},//----权限ID
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
})
Permission.belongsToMany(Role, {as: 'role', through: Role_permission, foreignKey: 'permission_id'})
Role.belongsToMany(Permission, {as: 'permission', through: Role_permission, foreignKey: 'role_id'})
Role_permission.belongsTo(Role, { as: 'role', through: Role, foreignKey: 'role_id'})
Role_permission.belongsTo(Permission, { as: 'permission', through: Permission, foreignKey: 'permission_id'})
module.exports = Role_permission
