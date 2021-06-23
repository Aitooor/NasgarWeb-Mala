const express = require("express");

/** 
 * @param {express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 * @param {express.NextFunction} next
 */
function middleware(req, res, next) {
	/** @type {import("..").UserData} */
	const userData = {
		account: {
			level: {
				string: req.session.accountLevelString,
				int: req.session.accountLevelInt
			}
		}
	};

	req.userData = userData;
	res.locals.userData = userData;
	res.locals.server = {
		ip: "nasgar.online"
	}

	res.locals.alert = {
		show: false,
		text: ""
	};

	next();
}


module.exports = {
	middleware
}