module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
	router.get("/login", (req, res) => {
		res.render("pags/login");
	});

	router.get("/signup", (req, res) => {
		res.render("pags/signup");
	});
});