Object.defineProperty(exports, "__esModule", { value: true });

// Modules
const express = require("express");
const { join } = require("path");
const { createServer } = require("http");

// My libs
const logger = require("./lib/logger");
const userDataByReq = require("./lib/userDataByReq");
const normalizeSession = require("./lib/normalizeSession");
const database = require("./lib/database");
const rcon = require("./lib/rcon");
const paypal = require("./api/paypal");
const languageMidd = require("./middlewares/language").middleware;

// Configuration
const CONFIG = require("../config");

const inProduction = process.env.NODE_ENV === "production";

// Setup
const app = express();
const server = createServer(app);

// Config view engine
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// Config
app.use(
  require("express-session")({
    secret: CONFIG.SESSION_KEY,
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(
  require("express-fileupload")({
    preserveExtension: true,
    useTempFiles: true,
    tempFileDir: join(__dirname, "db", "tmpFiles"),
    parseNested: true,
    abortOnLimit: true,
    responseOnLimit: "File is very bigger",
    safeFileNames: true,
  })
);
app.use(express.static(join(__dirname, "public")));

logger.log("+—————————————————+");
logger.log("| Starting Server |");
logger.log("+—————————————————+");
logger.log("");

paypal.configure();

// Init All
(async () => {
  const db = await database(app);
  const rcons = false ? null : await rcon(...CONFIG.RCON.PORTS);
  //const io = await socketio(server, db.createPool);

  app.use(normalizeSession);
  app.use(userDataByReq(db.createPool).middleware);
  app.use(languageMidd);

  require("./routes")(app, db.createPool, rcons);
})();

module.exports = server;
