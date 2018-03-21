module.exports = {
   host: "http://localhost",
   fileHost: "http://localhost/",
   mongodb: {
      connurl: 'mongodb://localhost/bank',//本地
      // connurl: 'mongodb://bank:bank20171023@119.23.216.58/bank',//测试
      // connurl: 'mongodb://bank:bank20171023@104.225.145.3/bank',//测试
   },
   postgre: {
		connurl: 'postgres://postgres:first_test@localhost:5432/first_test',
		// connurl: 'postgres://postgres:first_test@104.225.145.3:5432/first_test',
	},
}