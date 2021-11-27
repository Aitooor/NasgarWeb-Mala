const { Router } = require("express");

/** @type {import("./extra")} */
module.exports = function (route, ...args) {
  const router = new Router();

  /** @type {import("../../a").Routes.pFunc} */
  function exec(v) {
    v(...args);
  }

  exec(route);
  router.use(route.thisRoute, route.r);

  return router;
};
