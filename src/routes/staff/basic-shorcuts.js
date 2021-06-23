const { StaffMiddleware } = require("../../middlewares/staff");

/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = function(app) {
	app.get("/staff/controls", StaffMiddleware, (req, res) => {
		res.redirect("/staff/basic-dev/shorcuts");
	});

	app.get("/staff/basic-dev/shorcuts", StaffMiddleware, (req, res) => {
		res.render("pags/staff/shorcuts");
	});
}