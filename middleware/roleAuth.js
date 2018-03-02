module.exports = async (ctx, next) => {
  const urlArr = ctx.path.split('/')
  urlArr.shift()
  console.log(urlArr)
  await next()
}