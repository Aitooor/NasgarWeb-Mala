const StaffMiddleware = require("../../middlewares/staff").default;
/**
 * 
 * @param {import('express').Express} app 
 */
module.exports = function(app) {
	app.use((req, res, next) => {
		if(req.path.startsWith("/Tests")) StaffMiddleware(req, res, next);
		next();
	})
	app.get("/Tests", (req, res) => {
		res.render("Tests");
	});
}