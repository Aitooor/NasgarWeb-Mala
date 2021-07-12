const { StaffMiddleware, alertNotStaff } = require("../../middlewares/staff");

module.exports = require("../../lib/Routes/exports")("/staff", (router, waRedirect, db, rcons) => {
	router.get("/login", (req, res) => {
		if(!req.session.isStaff) return res.render("pags/staff/login");
		res.redirect("/");
	});

	router.post("/login", (req, res) => {
		if(req.body.password === process.env.TESTER_PASSWORD) {
			req.session.isStaff = true;
			req.session.accountLevelInt = 2;
			req.session.alert = "Now, you are part of the staff";
			req.session.showAlert = true;
			if(req.session.staffLogin_landing) {
				res.redirect(req.session.staffLogin_landing);
			} else {
				res.redirect("/");
			}
		} else alertNotStaff(req, res);
	});

	router.post("/logout", StaffMiddleware, (req, res) => {
		req.session.isStaff = false;
		req.session.accountLevelInt = 0;
		req.session.alert = "Now, you are not part of the staff";
		req.session.showAlert = true;
		res.redirect("/");
	});
})