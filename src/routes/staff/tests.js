const StaffMiddleware = require("../../middlewares/staff").default;
/**
 * 
 * @param {import('express').Express} app
 * @param {() => import("mysql").Pool} db
 */
module.exports = function(app, db) {
	app.use((req, res, next) => {
		if(req.path.startsWith("/Tests")) StaffMiddleware(req, res, next);
		next();
	})
	app.get("/Tests", (req, res) => {
		res.render("Tests");
	});
}