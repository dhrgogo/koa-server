const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
//菜单表
const Permission = require('./permission')
const Role = require('./role')

const Menu = sequelize.define('Menu', {
    unique_id: {type: INTEGER}, //唯一id
    permission_id: {type: INTEGER}, //   菜单权限
    menu: {type: STRING}, //
    url: {type: STRING}, // -------------------路径
    sort: {type: STRING}, // -----------------排序
    style: {type: STRING}, // ---------------样式（可设置css图标）
    parent_id: {type: STRING}, // ----------父主键ID
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    } //状态（0：未删除 1：删除）
})
Menu.belongsTo(Role, { as: 'role', through: Role, foreignKey: 'role_id'})

module.exports = Menu
