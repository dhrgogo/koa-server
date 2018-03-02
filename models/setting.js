const { Sequelize, sequelize } = App.Sequelize
const { STRING, INTEGER, JSON, JSONB, DOUBLE, RANGE, DATE, ARRAY } = Sequelize

const GuaranteeTypeFile = sequelize.define('guaranteeTypeFile', {
  name: {type: STRING, unique: true}, // 保函类型名
  file: {type: STRING} // url
})

exports.GuaranteeTypeFile = GuaranteeTypeFile