const rts = [
  require("./routes/api"),
  require("./routes/client"),
  require("./routes/account"),
  require("./routes/staff"),
  require("./routes/errors"),
];

/** @type {import("./routes")} */
module.exports = function routes(app, ...args) {
  function exec(v) {
    v(...args);
  }

  for (const Route of rts) {
    exec(Route);
    app.use(Route.thisRoute, Route.r);
  }
};
