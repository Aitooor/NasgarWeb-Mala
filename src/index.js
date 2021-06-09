// Modules
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



app.use((req, res) => {
	res.render("Tests")
})

module.exports = app;