"use strict";

let { fileHost } = App.Config

exports.create = async ctx => {

	let { originalname, path, filename } = ctx.req.file

   path = path.replace('public/uploads/', '')
   
	ctx.body = {
		errorCode: 0,
		data: {
			originFilename: originalname,
			path: path,
			url: fileHost + path,
		}
	}

}