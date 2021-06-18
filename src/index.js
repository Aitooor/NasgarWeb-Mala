// TODO: Connect paypal to this shit server
// TODO: Connect minecraft server to, again, this server of shit


// Modules
const createError = require("http-errors");
const express = require('express');
const { join } = require("path");
const morgan = require('morgan');
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const paypal = require("paypal-rest-sdk");
// const paypal = require("paypal");

// My libs
const userDataByReq = require("./helpers/userDataByReq");
const normalizeSession = require("./helpers/normalizeSession");

// DotEnv
require("dotenv").config({ path: ".env" });

// Setup
const app = express();

// Config ejs engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Config
app.use(session({
	secret: process.env.SESSION_KEY,
	saveUninitialized: true,
	resave: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

// paypal.configure({
// 	mode: "sandbox",
// 	client_id: "Afl20x8iHhEekyvHPb9InWvRH58uj794Og9fwtkuJfk3tQX4UO7umCR1zxUs7sBQpT_B0aL2w5bLL1Oz",
// 	client_secret: process.env.PAYPAL_SECRET
// })
// const environmentPaypal = new paypal.core.SandboxEnvironment(
// 	"Afl20x8iHhEekyvHPb9InWvRH58uj794Og9fwtkuJfk3tQX4UO7umCR1zxUs7sBQpT_B0aL2w5bLL1Oz",
// 	process.env.PAYPAL_SECRET);

// const clientPaypal = 


app.use(normalizeSession);
app.use(userDataByReq.middleware);

app.get("/", (req, res) => {
	console.log(req.userData);
	console.log(req.session.showAlert);

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

// app.get("/PaypalTest", (req, res) => {
// 	paypal.payment.create({
// 		"intent": "sale",
// 		"payer": {
// 			"payment_method": "paypal"
// 		},
// 		"redirect_urls": {
// 			"return_url": "/",
// 			"cancel_url": "/Tests" // REMEMBER TO DESTORY ALL COOKIES WHEN CALLING THIS
// 		},
// 		"transactions": [{
// 			"item_list": {
// 				"items": [{
// 					"name": "package_name",
// 					"sku": "package_name",
// 					"price": 25,
// 					"currency": "USD",
// 					"quantity": 1
// 				}]
// 			},
// 			"amount": {
// 				"currency": "USD",
// 				"total": 25
// 			},
// 			"description": "My description - Oh yeah"
// 		}]
// 	  }, (err, payment) => {
// 		  if(err) throw err;
// 		  console.log(payment);
// 		  res.redirect(payment.links[1].href);
// 	  });
// })

app.get("/login", (req, res) => {
	res.render("pags/login");
});
app.get("/signup", (req, res) => {
	res.render("pags/signup");
});


{
	function alertNotStaff(req, res) {
		req.session.alert = "You are not part of the staff, please enter a correct password for your level in <b class\"code\">/staff</b>";
		req.session.showAlert = true;
		res.redirect("/");
	}
	function StaffMiddleware(req, res) {
		if(req.session?.isStaff === true) next();
		else alertNotStaff(req, res);
	}

	{
		function middleware(password, {req, res} = {}) {
			if(password === process.env.TESTER_PASSWORD) {
				req.session.isStaff = true;
				req.session.accountLevelInt = 2;
				req.session.alert = "Now, you are part of the staff";
				req.session.showAlert = true;
				res.redirect("/");
			} else alertNotStaff(req, res);
		}

		app.get("/staff", (req, res) => {
			if(!req.session.isStaff) return res.render("pags/staff/login");
			res.redirect("/");
		});

		app.post("/staff", (req, res) => {
			console.log(req.body);
			middleware(req.body.password, {req, res});
		});
	}

	app.get("/Tests", StaffMiddleware, (req, res) => {
		res.render("Tests");
	});
}


app.get("/ResetSession", (req, res) => {
	req.session.destroy((err) => {
		if(err) return res.render("errors/500");
		res.redirect("/");
	});
})

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

module.exports = app;