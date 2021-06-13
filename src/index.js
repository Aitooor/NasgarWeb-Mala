// Modules
const createError = require("http-errors");
const express = require('express');
const { join } = require("path");
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

// DotEnv
require("dotenv").config({ path: ".env" });

// Setup
const app = express();

// Config ejs engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Config
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));


app.get("/", (req, res) => {
	res.render("pags/index");
});

app.get("/Tests", (req, res) => {
	res.render("Tests");
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