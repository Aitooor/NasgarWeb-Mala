
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

/*
const emailTransport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "apikamailer@gmail.com",
		pass: "Mailer_Test#01"
	}
});

emailTransport.sendMail({
	from: "Apika Luca",
	to: "bjqf0724@gmail.com",
	subject: "Email verification3",
	text: "Verificate the email",
	html: `


<table class="body" style="margin: 0;box-sizing: padding-box;table-layout: fixed;border-collapse: separate;border-color: #00F;width: 100%;height: 100vh;background: #EEE9;">
<tbody style="margin: 0;box-sizing: padding-box;">
	<tr style="margin: 0;box-sizing: padding-box;">
	<td style="margin: 0;box-sizing: padding-box;min-width: 10%;"></td>
	<td class="header_space" style="margin: 0;box-sizing: padding-box;width: 80%;max-width: 600px;height: 30%;min-width: 10%;">
		<table class="header" style="margin: 0;box-sizing: padding-box;table-layout: fixed;border-collapse: separate;border-color: #00F;width: 100%;height: 100%;">
		<tbody style="margin: 0;box-sizing: padding-box;">
			<tr style="margin: 0;box-sizing: padding-box;">
			<td style="margin: 0;box-sizing: padding-box;width: 15%;"></td>
			<td class="header_center" style="margin: 0;box-sizing: padding-box;">
				<img width="100%" src="https://web.nasgar.online/img/logo-480x.png" style="margin: 0;box-sizing: padding-box;">
			</td>
			<td style="margin: 0;box-sizing: padding-box;width: 15%;"></td>
			</tr>
			<tr style="margin: 0;box-sizing: padding-box;">
			<td style="margin: 0;box-sizing: padding-box;width: 15%;"></td>
			<td class="header_center header_title" style="margin: 0;box-sizing: padding-box;font-size: 28px;font-weight: 300;text-align: center;">
				Email verification
			</td>
			<td style="margin: 0;box-sizing: padding-box;width: 15%;"></td>
			</tr>
		</tbody>
		</table>
	</td>
	<td style="margin: 0;box-sizing: padding-box;min-width: 10%;">
	</td></tr>
	<tr style="margin: 0;box-sizing: padding-box;">
	<td style="margin: 0;box-sizing: padding-box;min-width: 10%;"></td>
	<td style="margin: 0;box-sizing: padding-box;min-width: 10%;">
		<table class="card" style="margin: 0;box-sizing: padding-box;table-layout: fixed;border-collapse: separate;border-color: #00F;height: 100%;background: #FFF;">
		<tbody style="margin: 0;box-sizing: padding-box;">
			<tr class="card_top" style="margin: 0;box-sizing: padding-box;height: 10px;"></tr>
			<tr style="margin: 0;box-sizing: padding-box;">
			<td style="margin: 0;box-sizing: padding-box;text-align: center;">
				Confirm your email pressing the follow button.
			</td></tr>
			<tr style="margin: 0;box-sizing: padding-box;">
			<td style="margin: 0;box-sizing: padding-box;text-align: center;">
				<a class="card__link" href="" style="margin: 0;box-sizing: padding-box;color: #FFF;font-weight: 400;text-decoration: none;padding: 15px 30px;background: #3880be;border: 2px solid transparent;border-radius: 5px;font-size: 18px;">Confirm email</a>
			</td></tr>
			<tr style="margin: 0;box-sizing: padding-box;">
			<td style="margin: 0;box-sizing: padding-box;text-align: center;">
				If you don't sign up in 
				<a href="https://web.nasgar.online" style="margin: 0;box-sizing: padding-box;color: #3880be;font-weight: 500;text-decoration: none;">Nasgar Network</a> 
				ignore this message or contact us on 
				<a href="https://ds.nasgar.online" style="margin: 0;box-sizing: padding-box;color: #3880be;font-weight: 500;text-decoration: none;">Discord</a>
			</td></tr>
			<tr class="card_bottom" style="margin: 0;box-sizing: padding-box;height: 50%;"></tr>
		</tbody>
		</table>
	</td>
	<td style="margin: 0;box-sizing: padding-box;min-width: 10%;">
	</td></tr>
</tbody>
</table>
`,
	priority: "normal",
	messageId: "<type-0+line-1+msg-1@nasgarnetwork>",
}, (err, info) => {
	console.log(err, info);
})
*/


console.log("\n");
console.log("+—————————————————+");
console.log("| Starting Server |");
console.log("+—————————————————+");
console.log("");

console.log("Paypal is connected");

// Init All
(async () => {
	const db = await database(app);
	const rcons = true ? null : await rcon(...CONFIG.RCON.PORTS);
	//const io = await socketio(server, db.createPool);
	require("./routes")(app, db.createPool, rcons);
})();

module.exports = server;
