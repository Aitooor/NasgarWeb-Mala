const { StaffMiddleware, alertNotStaff } = require("../../middlewares/staff");
const CONFIG = require("../../../config");
const express = require("express");

/**
 * @param {string} path
 * @returns {(req: express.Request, res: express.Response, next: express.NextFunction) => void}
 */
function AdminMiddleware(path) {
	return (req, res, next) => {
		if(req.session.admin) 
			next();
		else {
			res.type("html").send(`<!DOCTYPE html> <html> <head> <title>Admin verification</title></head> <body> <form style="display:none;" action="/staff/admin/login" method="POST"> <input name="path" value="${path}"> <input name="password"> <button type="submit"></button> </form> <script> function _try() { const pass = prompt("Password: "); if(pass.length > 0) { document.querySelector("input[name=\\"password\\"]").value=pass; document.querySelector("button").click(); } else { _try(); } }; _try(); </script> </body> </html>`);
		}
	}
}

module.exports = require("../../lib/Routes/exports")("/staff", (router, waRedirect, db, rcons) => {
	router.post("/admin/login", (req, res) => {
		if(CONFIG.TIMING_PASS === req.body.password)
			req.session.admin = true;
		res.redirect(req.body.path);
	});

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

	router.get("/shop/panel", AdminMiddleware("/staff/shop/panel"), (_req, res) => {
		res.render("pags/staff/shopPanel");
	});
	
	router.get("/staff-timings", AdminMiddleware("/staff/staff-timings"), (_req, res) => {
		res.render("pags/staff/timings");
	});
})
