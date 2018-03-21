"use strict"
const {Sequelize, sequelize} = App.Sequelize
/*--------------------mongodb----------------------*/
exports.Sequelize = require('./mongodb/mongoLog')


/*--------------------PG----------------------*/

const Admin = require('./sequelize/admin')
const Department = require('./sequelize/department')
const Role = require('./sequelize/role')
const User = require('./sequelize/user')
// sequelize.sync({force: true})

module.exports = {
    PG:{
        Admin,
        Department,
        Role,
        User
    }
}