const {Sequelize, sequelize} = App.Sequelize
const {STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE} = Sequelize
const Department = sequelize.define('department', {
    parentid: {type: INTEGER,comment:'父部门id'},//父部门的id
    order: {type: INTEGER},//部门名称
    name: {type: STRING,comment:'部门名称'}
})
module.exports = Department