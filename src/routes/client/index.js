module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
	router.get("/", async (req, res) => {
		
		res.render("pags/index");
	});

	router.get("/shop", (req, res) => {
		res.render("pags/shop/index");
	})

	router.get("/ResetSession", (req, res) => {
		req.session.destroy((err) => {
			if (err) return res.render("errors/500");
			res.redirect("/");
		});
	});
})