// TODO: Connect minecraft server to, again, this server of shit
const inProduction = process.env.NODE_ENV === "production";

// Modules
const createError = require("http-errors");
const express = require('express');
const { join } = require("path");
const morgan = require('morgan');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const paypal = require("paypal-rest-sdk");
const storage = require("node-persist");

// My libs
const userDataByReq = require("./helpers/userDataByReq");
const normalizeSession = require("./helpers/normalizeSession");

//* Routes
const Routes = require("./routes");

// Environment variables - Dev
if(!inProduction) require("dotenv").config({ path: ".env" });

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

app.use(normalizeSession);
app.use(userDataByReq.middleware);

paypal.configure({
	mode: inProduction ? "live" : "sandbox",
	client_id: process.env.PAYPAL_ID,
	client_secret: process.env.PAYPAL_SECRET
});

storage.init({
	dir: "./storage"
}).then(() => {
	Routes(app);
});

module.exports = app;