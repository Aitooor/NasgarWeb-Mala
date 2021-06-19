const { alertNotStaff } = require("../../middlewares/staff");

module.exports = function(app) {
	app.get("/staffLogin", (req, res) => {
		if(!req.session.isStaff) return res.render("pags/staff/login");
		res.redirect("/");
	});
	
	app.post("/staffLogin", (req, res) => {
		if(req.body.password === process.env.TESTER_PASSWORD) {
			req.session.isStaff = true;
			req.session.accountLevelInt = 2;
			req.session.alert = "Now, you are part of the staff";
			req.session.showAlert = true;
			res.redirect("/");
		} else alertNotStaff(req, res);
	});

	require("./tests")(app);
}