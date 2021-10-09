const express = require("express");

function alertNotStaff(req, res) {
	req.session.alert = "You are not part of the staff, please enter a correct password for your level in <b class\"code\"><a href=\"/staffLogin\">/staffLogin</a></b>";
	req.session.showAlert = true;
	res.redirect("/staff/login");
}

/**
 * 
 * @param {express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function StaffMiddleware(req, res, next) {
	if(req.session?.isStaff === true) next();
	else {
		req.session.staffLogin_landing = req.url;
		alertNotStaff(req, res);
	}
}

module.exports = {
	StaffMiddleware,
	alertNotStaff
};
module.exports.default = StaffMiddleware;