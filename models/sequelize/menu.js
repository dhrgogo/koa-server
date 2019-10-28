const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
//菜单表
const Menu = sequelize.define('Menu', {
    menu: {type: STRING}, //
    permission_id: {type: STRING}, //   菜单权限
    url: {type: STRING}, // -------------------路径
    sort: {type: STRING}, // -----------------排序
    style: {type: STRING}, // ---------------样式（可设置css图标）
    parent_id: {type: STRING}, // ----------父主键ID
    create_time: {type: STRING}, // -------创建时间
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
})

module.exports = Menu
