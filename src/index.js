// TODO: Connect minecraft server to, again, this server of shit
const inProduction = process.env.NODE_ENV === "production";

// Modules
const createError = require("http-errors");
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
	if(req.method !== "GET" || !inProduction) return next();
	console.log(req.protocol);
	if(req.protocol === "http") res.redirect(`https://${req.hostname}${req.path}`);
})

// Init paypal

paypal.configure({
	mode: inProduction ? "live" : "sandbox",
	client_id: process.env.PAYPAL_ID,
	client_secret: process.env.PAYPAL_SECRET
});

// Init DB
require("./lib/database")(app);

module.exports = app;