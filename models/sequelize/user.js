const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, ARRAY, TEXT, JSON, JSONB, DOUBLE, RANGE, DATE, BOOLEAN} = Sequelize
const Department = require('./department')
const User = sequelize.define('user', {
    userid: {type: INTEGER},//id 唯一
    name: {type: STRING, comment: '姓名'}, //
    english_name: {type: STRING},//
    mobile: {
        type: STRING,
        unique: true,
        validate: {
            len: 11,
            isNumeric: true
        }
    },
    department: {type: STRING},//
    order: {type: INTEGER}, //排序
    position: {type: STRING}, //职位
    gender: {type: INTEGER},// 性别
    email: {
        type: STRING, validate: {isEmail: true}
    },// 公司名
    telephone: {type: STRING},// 电话
    isleader: {type: STRING},//上级字段，标识是否为上级。在审批等应用里可以用来标识上级审批人
    user_img: {type: STRING},
    enable: {type: INTEGER},//启用/禁用成员。1表示启用成员，0表示禁用成员
    extattr: {type: ARRAY(TEXT)}//自定义字段。自定义字段需要先在WEB管理端添加
})

Department.hasMany(User, {as: 'department', foreignKey: 'department_id'})
User.belongsTo(Department, {as: 'user', foreignKey: 'department_id'})

module.exports = User