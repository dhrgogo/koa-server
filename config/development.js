module.exports = {
   host: "http://api.bank.hyhit.net/",
   fileHost: "http://files.bank.hyhit.net/",
   mongodb: {
      connurl: 'mongodb://127.0.0.1:27017/qhw',
   },
   postgre: {
      // connurl: 'postgres://bank:bank20171023@localhost:5432/bank',
      connurl: 'postgres://postgres:dhr@localhost:5432/dhr',
   },
   mysql: {
      connurl: 'mysql://root:password@localhost:3306/qhiwi',
      // connurl: 'mysql://root:donghuaren@123@120.78.158.34:3306/qhiwi',
      // connurl: 'mysql://root:donghuaren@123@47.95.200.82:3306/qhiwi',
      // connurl: 'mysql://root:qhiwi@123123@localhost:3306/qhiwi',
   }
}
