const {Sequelize, sequelize} = App.Sequelize

const ClientCompany = require('./mongoLog')
// sequelize.sync({force: true})

module.exports = {
    ClientCompany
}