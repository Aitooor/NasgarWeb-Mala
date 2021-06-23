const { alertNotStaff } = require("../../middlewares/staff");

/**
 * 
 * @param {import("express").Express} app 
 * @param {() => import("mysql").Pool} db 
 */
module.exports = function(app, db) {
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
			if(req.session.staffLogin_landing) {
				res.redirect(req.session.staffLogin_landing);
			} else {
				res.redirect("/");
			}
		} else alertNotStaff(req, res);
	});

	require("./tests")(app, db);
	require("./basic-shorcuts")(app);
}