const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
//权限表
const Permission = sequelize.define('Permission', {
    // permission_id: {type: INTEGER},//--------权限ID（自定义）可设置唯一索引UNIQUE
    unique_id: {type: INTEGER}, //唯一id
    permission_name: {type: STRING},//---权限名称
    permissionDesc: {type: STRING},//----权限描述
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
})

module.exports = Permission
