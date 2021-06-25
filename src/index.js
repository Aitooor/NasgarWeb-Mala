// TODO: Connect minecraft server to, again, this server of shit
const inProduction = process.env.NODE_ENV === "production";

// Modules
const express = require('express');
const { join } = require("path");
const paypal = require("paypal-rest-sdk");

// My libs
const userDataByReq = require("./lib/userDataByReq");
const normalizeSession = require("./lib/normalizeSession");

// Environment variables - Dev
if(!inProduction) require("dotenv").config({ path: ".env" });

// Setup
const app = express();

// Config view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Config
app.use(require("express-session")({
	secret: process.env.SESSION_KEY,
	saveUninitialized: true,
	resave: true
}));

// if(!inProduction) app.use(require('morgan')("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(express.static(join(__dirname, "public")));

app.use(normalizeSession);
app.use(userDataByReq.middleware);

app.use((req, res, next) => {
	// if(!inProduction) return next();
	// const urlParsed = new URL(req.url);
	// console.log(urlParsed.protocol, urlParsed.hostname, urlParsed.path);
	// if(req.method.toUpperCase() !== "GET") 
	// 	next();
	// else if(urlParsed.protocol === "https:") 
	// 	next();
	// else if(urlParsed.protocol === "http:") 
	// 	res.redirect(`https://${urlParsed.hostname}${urlParsed.path}`);
	// else next();
	next();
})

// Init paypal

paypal.configure({
	mode: inProduction ? "live" : "sandbox",
	client_id: process.env.PAYPAL_ID,
	client_secret: process.env.PAYPAL_SECRET
});

// Init DB
(async () => {
	await require("./lib/database")(app);
})();

module.exports = app;