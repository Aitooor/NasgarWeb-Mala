const { StaffMiddleware } = require("../middlewares/staff");
const { timeago } = require("../utils");

/**
 * 
 * @param {import("express").Express} app 
 * @param {() => import("mysql").Pool} db
 */
module.exports = require("../lib/Routes/exports")("/api", (router, waRedirect, db, rcons) => {
	router.get("/get/bans/recents", StaffMiddleware, async (req, res) => {
		const dataCrude = await (db()).query("SELECT * FROM bungee.PunishmentHistory;");

		const data = [];
		dataCrude.reverse().forEach(v => {
			const now = new Date();
			const times = parseInt(v.end != "-1" ? v.start : v.end);
			const time = new Date(times);
			if((now.getMonth() - time.getMonth() > 0) || (now.getFullYear() - time.getFullYear() > 0)) return;
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
	});

	router.get("/get/product/:uuid", (req, res) => {
		res
			.type("json")
			.send({
				uuid: req.params.uuid,
				name: "Normal Key x5",
				price: "1.50",
				description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quo plebiscito decreta a senatu est consuli quaestio Cn. Duarum enim vitarum nobis erunt instituta capienda. Duo Reges: constructio interrete. Qualem igitur hominem natura inchoavit? Huius, Lyco, oratione locuples, rebus ipsis ielunior. \nPrimum in nostrane potestate est, quid meminerimus? An vero, inquit, quisquam potest probare, quod perceptfum, quod. Itaque vides, quo modo loquantur, nova verba fingunt, deserunt usitata.  Quae quo sunt excelsiores, eo dant clariora indicia naturae. At certe gravius. Quid dubitas igitur mutare principia naturae? ",
				images: ["/img/defaultKey.png", "no Image"]
			});
	})
})