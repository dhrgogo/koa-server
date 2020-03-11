const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
//角色用户关联表
const User = require('./user')
const Role = require('./role')
const User_role = sequelize.define('User_role', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },//-------------角色ID
    user_id: {type: INTEGER},//------------用户ID
    role_id: {type: INTEGER} //-------------角色I
})
User.belongsToMany(Role, {as: 'role', through: User_role, foreignKey: 'user_id'})
Role.belongsToMany(User, {as: 'user', through: User_role, foreignKey: 'role_id'})
User_role.belongsTo(Role, { as: 'role', through: Role, foreignKey: 'role_id'})
User_role.belongsTo(User, { as: 'user', through: User, foreignKey: 'user_id'})
module.exports = User_role
