const {Sequelize, sequelize} = App.Sequelize

const ClientCompany = require('./clientCompany')
const ClientRole = require('./clientRole')
const ClientUser = require('./clientUser')
const Project = require('./project')
const Guarantee = require('./guarantee')
const BankUser = require('./bankUser')
const BankRole = require('./bankRole')
const CustomerUser = require('./customerUser')
const Order = require('./order')
const Setting = require('./setting')


const Admin = require('./sequelize/admin')
const Department = require('./sequelize/department')
const Role = require('./sequelize/role')
const User = require('./sequelize/user')

// sequelize.sync({force: true})

module.exports = {
    ClientCompany,
    ClientRole,
    ClientUser,
    Project,
    Guarantee,
    BankUser,
    BankRole,
    Order,
    CustomerUser,
    Setting,
    Admin,
    Department,
    Role,
    User
}