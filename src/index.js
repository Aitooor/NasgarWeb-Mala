
Object.defineProperty(exports, "__esModule", { value: true });

// Modules
const express = require('express');
const { join } = require("path");
const paypal = require("paypal-rest-sdk");
//const passport = require("passport");
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
const nodemailer = require("nodemailer");
const { createServer } = require('http');

// My libs
const userDataByReq = require("./lib/userDataByReq");
const normalizeSession = require("./lib/normalizeSession");
const database = require("./lib/database");
const rcon = require("./lib/rcon");

// Configuration
const CONFIG = require("../config");

const inProduction = process.env.NODE_ENV === "production";

// Setup
const app = express();
const server = createServer(app);

// Config view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Config
app.use(require("express-session")({
	secret: CONFIG.SESSION_KEY,
	saveUninitialized: true,
	resave: true
}));

// Show HTTP Requests
// if(!inProduction) app.use(require('morgan')("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(require("express-fileupload")({
	preserveExtension: true,
	useTempFiles: true,
	tempFileDir: join(__dirname, "db", "tmpFiles"),
	parseNested: true,
	abortOnLimit: true,
	responseOnLimit: "File is very bigger",
	safeFileNames: true,
}));
app.use(express.static(join(__dirname, "public")));

app.use(normalizeSession);
app.use(userDataByReq.middleware);

// Init paypal -- Dev
paypal.configure({
	mode: "sandbox",
	client_id: CONFIG.PAYPAL.SANDBOX.ID,
	client_secret: CONFIG.PAYPAL.SANDBOX.SECRET
});

console.log("\n");
console.log("+—————————————————+");
console.log("| Starting Server |");
console.log("+—————————————————+");
console.log("");

console.log("Paypal is connected");

// Init All
(async () => {
	const db = await database(app);
	const rcons = false ? null : await rcon(...CONFIG.RCON.PORTS);
	//const io = await socketio(server, db.createPool);
	require("./routes")(app, db.createPool, rcons);
})();

module.exports = server;
