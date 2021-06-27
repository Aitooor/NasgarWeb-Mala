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

// Init paypal

paypal.configure({
	mode: inProduction ? "live" : "sandbox",
	client_id: process.env.PAYPAL_ID,
	client_secret: process.env.PAYPAL_SECRET
});

// Init DB
(async () => {
	const db = await require("./lib/database")(app);
	const rcons = await require("./lib/rcon")(process.env.RCON_PORT1, process.env.RCON_PORT2);
	require("./routes")(app, db.createPool, rcons);
})();

module.exports = app;