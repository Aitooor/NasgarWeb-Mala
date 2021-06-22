const StaffMiddleware = require("../../middlewares/staff").default;
/**
 * 
 * @param {import('express').Express} app
 * @param {import("node-persist")} storage
 */
module.exports = function(app, storage) {
	app.use((req, res, next) => {
		if(req.path.startsWith("/Tests")) StaffMiddleware(req, res, next);
		next();
	})
	app.get("/Tests", (req, res) => {
		res.render("Tests");
	});
	app.get("/Tests/activate", async (req, res) => {
		try {
			const testMode = await storage.getItem("Test_Mode");

			if(testMode === "activated") {
				req.session.alert = "<b>Test Mode</b> is already activated";
			} else {
				await storage.setItem("Test_Mode", "activated");
				req.session.alert = "Now <b>Test Mode</b> is activated";
			}

			req.session.showAlert = true;
		} catch {}
		res.redirect("/");
	});

	app.get("/Tests/desactivate", async (req, res) => {
		const testMode = await storage.getItem("Test_Mode");

		if(testMode === "desactivated" || !testMode) {
			req.session.alert = "<b>Test Mode</b> is already desactivated";
		} else {
			await storage.setItem("Test_Mode", "desactivated");
			req.session.alert = "Now <b>Test Mode</b> is desactivated";
		}

		req.session.showAlert = true;
		res.redirect("/");
	});
}