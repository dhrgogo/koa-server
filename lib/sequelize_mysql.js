const {postgre,mysql} = App.Config

const Sequelize = require("sequelize")

const sequelize = new Sequelize(mysql.connurl, {
    // logging: false
    operatorsAliases: false
})

sequelize
    .authenticate()
    .then(() => {
        console.log('mysql Connection has been established successfully.');
    })
    .catch(err => {
        console.error('mysql Unable to connect to the mysql database:', err)
    })
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
