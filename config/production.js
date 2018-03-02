module.exports = {
	host: "http://api.bank.hyhit.net/",
	fileHost: "http://files.bank.hyhit.net/",
	redis: {
		port: 6379,
		ip: "127.0.0.1",
		auth_pass: "biaojingli",
		options: {}
	},
	mongodb: {
		connurl: 'mongodb://bank:bank20171023@localhost/bank',
	},
	postgre: {
		connurl: 'postgres://bank:bank20171023@localhost:5432/bank',
	},
}