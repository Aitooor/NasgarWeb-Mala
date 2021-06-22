const express = require("express");

/**
 * @param {any} orgValue 
 * @param {any} value
 */
function undefinedCrit(orgValue, value) {
	if(typeof orgValue === "undefined" ) {
		return value;
	} else {
		return orgValue;
	}
}
/**
 * 
 * @param {string} paramName 
 * @param {(orgValue: any, value: any) => void} crit 
 * @param {any} value
 * @param {express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>} req 
 */
function def(paramName, crit, value, req) {
	req.session[paramName] = crit(req.session[paramName], value);
};

/**
 * @param {express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>} req 
 * @param {express.Response<any, Record<string, any>, number>} res 
 * @param {express.NextFunction} next 
 */
function normalizeSession(req, res, next) {
	def("accountLevelInt", undefinedCrit, -1, req);
	def("accountLevelString", undefinedCrit, "nologged", req);
	def("alert", undefinedCrit, undefined, req);
	def("showAlert", undefinedCrit, false, req);

	next();
}

module.exports = normalizeSession;