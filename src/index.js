// Modules
const createError = require("http-errors");
const express = require('express');
const { join } = require("path");
const morgan = require('morgan');
const session = require("express-session");
const cookieParser = require("cookie-parser");

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
}))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));


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


app.get("/login", (req, res) => {
	res.render("pags/login");
});

function TesterMiddleware(req, res) {
	if(req.session?.isTester === true) return next();

	req.session.alert = "You are not a tester, please enter a correct password in <b class\"code\">/Tester?password=[password]</b>";
	req.session.showAlert = true;
	res.redirect("/");
}

{
	function middleware(password, {req, res} = {}) {
		if(password === process.env.TESTER_PASSWORD) {
			req.session.isTester = true;
			req.session.alert = "Now, you are a tester";
			req.session.showAlert = true;
			res.redirect("/");
		} else {
			req.session.alert = "You are not a tester, please enter a correct password in <b class\"code\">/Tester</b>";
			req.session.showAlert = true;
			res.redirect("/");
		}
	}

	app.get("/Tester", (req, res) => {
		if(!req.session.isTester) return res.render("pags/tester/login");
		res.redirect("/");
	});

	app.post("/Tester", (req, res) => {
		console.log(req.body);
		middleware(req.body.password, {req, res});
	});
}

app.get("/Tests", TesterMiddleware, (req, res) => {
	res.render("Tests");
});


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