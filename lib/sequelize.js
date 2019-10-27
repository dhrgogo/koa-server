const {postgre} = App.Config

const Sequelize = require("sequelize")

const sequelize = new Sequelize(postgre.connurl, {
  // logging: false
  operatorsAliases: false
})

sequelize
  .authenticate()
  .then(() => {
    console.log('postgre Connection has been established successfully.');
  })
  .catch(err => {
    console.error('postgre Unable to connect to the PG database:', err)
  })

  module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
