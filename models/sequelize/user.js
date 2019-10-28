const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
const Department = require('./department')
//用户表
const User = sequelize.define('User', {
    position: {type: STRING}, //职位
    name: {type: STRING, comment: '姓名'}, //
    english_name: {type: STRING},//
    phone: {
        type: STRING,
        unique: true,
        validate: {
            len: 11,
            isNumeric: true
        }
    },
    department: {type: STRING},//
    order: {type: INTEGER}, //排序
    sex: {type: INTEGER},// 性别
    email: {
        type: STRING,
        validate: {
            isEmail: true
        }
    },
    user_img: {type: STRING},
    is_deleted: {
        type: INTEGER,
        defaultValue: 0
    }//状态（0：未删除 1：删除）
    // enable: {type: INTEGER},//启用/禁用成员。1表示启用成员，0表示禁用成员
    // extattr: {type: ARRAY(TEXT)}//自定义字段。自定义字段需要先在WEB管理端添加
})

module.exports = User
