const CONFIG = require("../../../config");
const { middleware: userLevelMidd, Level } = require("../../middlewares/userLevel");

const adminMidd = userLevelMidd(Level.Admin, {
	moreThan: true,
	redirect: true,
	authPage: "/login"
});

module.exports = require("../../lib/Routes/exports")("/staff", (router, waRedirect, db, rcons) => {		
	router.get("/shop/products", adminMidd, (_req, res) => {
		res.render("pags/staff/shop/products");
	});
	
	router.get("/staff-timings", adminMidd, (_req, res) => {
		res.render("pags/staff/timings");
	});
})
