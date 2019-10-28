const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
//角色用户关联表
const User = require('./user')
const Role = require('./role')
const User_role = sequelize.define('User_role', {
    user_id: {type: INTEGER},//------------用户ID
    role_id: {type: INTEGER},//-------------角色ID
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
})
User.belongsToMany(Role, {as: 'role', through: User_role, foreignKey: 'user_id'})
Role.belongsToMany(User, {as: 'user', through: User_role, foreignKey: 'role_id'})
module.exports = User_role
