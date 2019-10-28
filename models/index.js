"use strict"
const {Sequelize, sequelize} = App.Sequelize
/*--------------------mongodb----------------------*/
exports.Sequelize = require('./mongodb/mongoLog')


/*--------------------PG----------------------*/


const Menu = require('./sequelize/menu')
const Permission = require('./sequelize/permission')
const Role = require('./sequelize/role')
const Role_permission = require('./sequelize/role_permission')
const User = require('./sequelize/user')
const User_role = require('./sequelize/user_role')

// sequelize.sync({force: true})
sequelize.sync({force: false})

module.exports = {
    PG: {
        Menu,
        Permission,
        Role,
        Role_permission,
        User,
        User_role
    }
}
