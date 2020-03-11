const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
//角色表
let Role = sequelize.define('Role', {
    unique_id: {type: INTEGER}, //唯一id
    role_name: {type: STRING},// -------角色名称
    name: {type: STRING},// -------角色名称
    roleDesc: {type: STRING},// -------角色描述
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
})

module.exports = Role
