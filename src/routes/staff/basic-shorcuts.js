const { StaffMiddleware } = require("../../middlewares/staff");
const { timeago } = require("../../utils");

/**
 * 
 * @param {import("express").Express} app 
 * @param {() => import("mysql").Pool} db
 */
module.exports = function(app, db) {
	app.get("/staff/controls", StaffMiddleware, (req, res) => {
		res.render("pags/admin/index");
	});

	app.get("/api/get/bans/recents", StaffMiddleware, async (req, res) => {
		const dataCrude = await (db()).query("SELECT * FROM bungee.PunishmentHistory;");

		const data = [];
		dataCrude.reverse().forEach(v => {
			if(!(v.punishmentType === "BAN" || v.punishmentType === "TEMP_BAN" || v.punishmentType === "IP_BAN")) return;	
			data.push({
				username: v.name,
				reporter: `${v.punishmentType.replace("_", " ")} - ${v.operator}`,
				message: v.reason,
				timestamp: timeago(new Date(parseInt(v.start))) + (v.end != "-1" ? " - " + timeago(new Date(parseInt(v.end))) : "")
			});
		});

		res
			.type("json")
			.send(data);
	})

	app.get("/staff/basic-dev/shorcuts", StaffMiddleware, (req, res) => {
		res.render("pags/staff/shorcuts");
	});
}