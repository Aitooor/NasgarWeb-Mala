// Modules
const express = require('express');
const { join } = require("path");

// DotEnv
require("dotenv").config({ path: "../.env" });

// Setup
const app = express();

// Config
app.set('views', join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));




app.use((req, res) => {
	res.render("Test")
})

module.exports = app;