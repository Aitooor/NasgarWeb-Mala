const inProduction = process.env.NODE_ENV === "production";


// Modules
const express = require('express');
const { join } = require("path");
const paypal = require("paypal-rest-sdk");
const { createServer } = require('http');

// My libs
const userDataByReq = require("./lib/userDataByReq");
const normalizeSession = require("./lib/normalizeSession");
const database = require("./lib/database");
const rcon = require("./lib/rcon");
const socketio = require("./lib/socketio");

// Configuration
const config = require("../config");

// Setup
const app = express();
const server = createServer(app);

// Config view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Config
app.use(require("express-session")({
	secret: config.SESSION_KEY,
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

// TODO: change `process.env` to `config`
// Init paypal -- Dev
/*
paypal.configure({
	mode: inProduction ? "live" : "sandbox",
	client_id: process.env.PAYPAL_ID,
	client_secret: process.env.PAYPAL_SECRET
}); //*/

// Init DB
(async () => {
	const db = await database(app);
	const rcons = false ? null : await rcon(...config.RCON.PORTS);
	const io = await socketio(server, db.createPool);
	require("./routes")(app, db.createPool, rcons, io);
})();

module.exports = server;
