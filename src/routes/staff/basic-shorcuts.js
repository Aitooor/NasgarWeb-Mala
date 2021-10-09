const { StaffMiddleware } = require("../../middlewares/staff");

/**
 * 
 * @param {import("express").Express} app 
 * @param {() => import("mysql").Pool} db
 */
module.exports = function(app, db) {
	app.get("/staff/controls", StaffMiddleware, (req, res) => {
		res.render("pags/admin/index");
	});

	app.get("/staff/basic-dev/shorcuts", StaffMiddleware, (req, res) => {
		res.render("pags/staff/shorcuts");
	});
}