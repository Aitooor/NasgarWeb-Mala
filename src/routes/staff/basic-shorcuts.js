const { StaffMiddleware } = require("../../middlewares/staff");
const { timeago } = require("../../utils");

/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = function(app) {
	app.get("/staff/controls", StaffMiddleware, (req, res) => {
		res.render("pags/admin/index");
	});

	app.get("/api/get/bans/recents", StaffMiddleware, (req, res) => {
		const data = new Array(100).fill({
			username: "iTito420",
			reporter: "Me",
			message: "Is a very sexy admin 🤤😋",
			timestamp: timeago(new Date(1625241870800))
		});

		res
			.type("json")
			.send(data);
	})

	app.get("/staff/basic-dev/shorcuts", StaffMiddleware, (req, res) => {
		res.render("pags/staff/shorcuts");
	});
}