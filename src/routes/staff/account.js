const { StaffMiddleware, alertNotStaff } = require("../../middlewares/staff");
const CONFIG = require("../../../config");

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
	
	router.get("/staff-timings", (req, res) => {
		if(req.session.admin) {
			res.render("pags/staff/timings");
		} else {
			res.type("html").send(`
<!DOCTYPE html>
<html>
	<head>
		<title>Admin verification</title>
	</head>
	<body>
		<form style="display:none;" action="/staff/staff-timings" method="POST">
			<input name="password">
			<button type="submit"></button>
		</form>
		<script>
			function _try() {
				const pass = prompt("Password: ");
				if(pass.length > 0) {
					document.querySelector("input").value=pass;
					document.querySelector("button").click();
				} else {
					_try();
				}
			}
			
			_try();
		</script>
	</body>
</html>
			`);
		}
	});
	
	router.post("/staff-timings", (req, res) => {
		if(CONFIG.TIMING_PASS === req.body.password)
			req.session.admin = true;
		res.redirect("/staff/staff-timings");
	});
})