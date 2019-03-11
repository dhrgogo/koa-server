module.exports = {
	host: "",
	fileHost: "",
	redis: {
		port: 6379,
		ip: "127.0.0.1",
		auth_pass: "biaojingli",
		options: {}
	},
	mongodb: {
		connurl: 'mongodb://localhost/bank',
	},
	postgre: {
		connurl: 'postgres://postgres:dhr@localhost:5432/bank',
	},
	mySql: {
		connurl: 'postgres://postgres:dhr@localhost:5432/bank',
	},
}