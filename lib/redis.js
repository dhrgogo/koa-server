const Config = App.Config
let Redis = require("redis").createClient()

Redis.auth(Config.redis.auth_pass)

Redis.on("error", function (err) {
  console.log("Error " + err)
})

Redis.getAsync = (key) => {
  return new Promise((resolve, reject) => {
    Redis.get(key, (err, value) => {
      resolve(value)
    })
  })
}

module.exports = Redis