// 子文档模型CRUD
const Model = App.Models

// 配置转换器
let models = function (modelName, options) {
	for (let key in options) {
		let item = options[key]
		item.modelName = modelName
		item.dataPath = key
		item.options = {}
		for (let key in item) {
			switch (key) {
				case 'get':
					// updateOne
					item.getModel = item.get
					item.get = models.get
					break
				case 'create':
					item.createModel = item.create
					item.create = models.create
					break
				case 'update':

					item.updateModel = item.update
					item.update = options => {

						let model = item.updateModel

						return async (ctx, next) => {

							let reqBody = ctx.request.body
							let verify = Validator(reqBody, model)
							if (verify.errorMsg) {
								ctx.body = {
									errorCode: 1000,
									msg: verify.errorMsg
								}
								return
							}

							if (!Model[item.modelName]) {
								ctx.body = {
									errorCode: 1000,
									msg: `${item.modelName}模型不存在`
								}
							}

							let filter = {}
							if (ctx.auth) {
								filter.user = ctx.auth.uid
							}

							Model[item.modelName].updateOne(filter, { [item.dataPath]: reqBody })

							await next()

						}

					}
					break
				case 'delete':
					item.deleteModel = item.delete
					item.delete = models.delete
					break
			}
		}
	}
	return options
}

models.get = options => {

	return async (ctx, next) => {

		let query = {}
		if (ctx.auth) {
			query._id = ctx.auth.uid
		}

		await User.findOne(query, { _id: 0, address: 1 }).then(data => {
			if (ctx.params.id) {
				for (let item of data.address) {
					if ((item._id + '') === ctx.params.id) {
						data = item
						break
					}
				}
			} else {
				data = data.address
			}
			ctx.body = {
				errorCode: 0,
				data: data
			}
		}).catch(err => {
			ctx.body = {
				errorCode: 1000,
				errorData: err,
				msg: '获取失败'
			}
		})

	}

}

models.create = options => {

	return async (ctx, next) => {

		let reqBody = ctx.request.body
		let verify = Validator(reqBody, {
			addressee: String,
			address: String,
			addresseeTelephone: String,
		})

		if (verify.errorMsg) {
			ctx.body = {
				errorCode: 1000,
				msg: verify.errorMsg
			}
			return
		}

		let filter = {}
		if (ctx.auth) {
			filter._id = ctx.auth.uid
		}

		await User.updateOne(filter, { $push: { address: reqBody } }).then(data => {
			ctx.body = {
				errorCode: 0,
				data: data
			}
		}).catch(err => {
			ctx.body = {
				errorCode: 1000,
				msg: '添加失败',
				errorData: err
			}
		})

	}

}

models.update = (options) => {

	console.log(options)

	return async (ctx, next) => {

		let dataPath = ctx.params.dataPath

		let models = dataPath.split('/')[0]
		if (options[models]) {

		} else {
			ctx.body = {
				errorCode: 1000,
				msg: '指定模型不存在'
			}
		}

		let filter = {
		   _id: ctx.auth.uid,
		   address: { $elemMatch: { _id: id } }
		}

		let reqBody = ctx.request.body
		reqBody._id = id

		await User.updateOne(options.query, { "address.$": reqBody }).then(data => {
		   ctx.body = {
		      errorCode: 0,
		      data: data
		   }
		}).catch(err => {
		   ctx.body = {
		      errorCode: 1000,
		      msg: '更新失败',
		      errorData: err
		   }
		})
	}

}

models.delete = options => {

	return async (ctx, next) => {

		let verify = Validator(ctx.params, {
			"id": "ObjectId"
		})

		if (verify.errorMsg) {
			ctx.body = {
				errorCode: 1000,
				msg: verify.errorMsg
			}
			return
		}

		let filter = {
			_id: ctx.auth.uid
		}

		await User.updateOne(filter, { $pull: { "address": { _id: ctx.params.id } } }).then(data => {
			ctx.body = {
				errorCode: 0,
				data: data
			}
		}).catch(err => {
			ctx.body = {
				errorCode: 1000,
				msg: '删除失败',
				errorData: err
			}
		})
	}

}

// function pathAnalysis () {
//    return 
// }

// pathAnalysis()

module.exports = models