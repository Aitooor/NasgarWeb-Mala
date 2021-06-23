const crypto = require("crypto");
/**
 * 
 * @param {import("express").Express} app 
 * @param {() => import("mysql").Pool} db 
 */
module.exports = function(app, db) {
	app.get("/", (req, res) => {
		const showAlert = req.session.showAlert;
		req.session.showAlert = false;

		if(showAlert)
			return res.render("pags/index", {alert: {
				text: req.session.alert,
				show: showAlert
			}});
		else 
			return res.render("pags/index");
	});

	app.get("/PaypalTest", (req, res) => {
		paypal.payment.create({
			"intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
			"redirect_urls": {
				"return_url": "http://localhost:1403/",
				"cancel_url": "http://localhost:1403/login"
			},
			"transactions": [{
				"item_list": {
					"items": [{
						"name": "package_name",
						"sku": "package_name",
						"price": 25,
						"currency": "USD",
						"quantity": 1
					}]
				},
				"amount": {
					"currency": "USD",
					"total": 25
				},
				"description": "My description - Oh yeah"
			}]
		}, (err, payment) => {
			if(err) throw err;
			console.log(payment);
			res.redirect(payment.links[1].href);
		});
	})

	app.get("/login", (req, res) => {
		res.render("pags/login");
	});

	app.post("/login", async (req, res) => {
		console.log(crypto.createHmac("sha256", "Nasgar19992%").update("quirte").digest("hex"));

		res.send("Hola");
	})
	app.get("/signup", (req, res) => {
		res.render("pags/signup");
	});

	app.get("/shop", (req, res) => {
		res.render("pags/shop/index");
	})

	app.get("/ResetSession", (req, res) => {
		req.session.destroy((err) => {
			if(err) return res.render("errors/500");
			res.redirect("/");
		});
	});

	require("./routes/staff/index")(app, db);

	//* Error - 404
	app.use((req, res, next) => {
		next(createError(404));
	});

	app.use((err, req, res, next) => {
		res.locals = {
			error: err
		};

		res.status(404);
		res.render("errors/404");
	});
}