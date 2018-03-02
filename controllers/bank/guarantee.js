const {Config, Models, Helper, ajv} = App
const {Sequelize} = Models
const {Guarantee} = Sequelize
const {Op} = App.sequelize

exports.details = async ctx => {
  const guaranteeNumber = ctx.params.id

  let where= {companys: {
    [Op.contains]: [{
      guaranteeNumber
    }]
  }}

  await Guarantee.findAll({
    where
  }).then(guarantee => {
    ctx.body = {
      errorCode: 0,
      data: guarantee
    }
  }).catch(err => {
    ctx.throw(err)
  })
}