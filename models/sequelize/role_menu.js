const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN } = Sequelize
// 角色菜单权限表关联表
const Menu = require( './menu' )
const Role = require( './role' )
const Role_menu = sequelize.define( 'Role_menu', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },//-------------角色ID
    role_id: { type: INTEGER },//-------------角色ID
    menu_id: { type: INTEGER },//----权限ID
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
} )
Menu.belongsToMany( Role, { as: 'role', through: Role_menu, foreignKey: 'menu_id' } )
Role.belongsToMany( Menu, { as: 'menu', through: Role_menu, foreignKey: 'role_id' } )
Role_menu.belongsTo( Role, { as: 'role', through: Role, foreignKey: 'role_id' } )
Role_menu.belongsTo( Menu, { as: 'menu', through: Menu, foreignKey: 'menu_id' } )
module.exports = Role_menu
