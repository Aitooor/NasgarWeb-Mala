const express = require("express");
const jwt = require("./jwt");
const Account = require("../api/account");
const UserLevel = require("../@types/userLevel")


module.exports = function(db) {
  /**
   * @param {express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>} req
   * @param {express.Response<any, Record<string, any>, number>} res
   * @param {express.NextFunction} next
   */
  async function middleware(req, res, next) {
    /** @type {import("..").UserData} */
    const userData = {
      account: {
        level: {
          string: req.session.accountLevelString,
          int: req.session.accountLevelInt,
        },
      },
    };

    req.userData = userData;
    res.locals.userData = userData;
    res.locals.server = {
      ip: "nasgar.online",
    };

    res.locals.alert = {
      show: req.session.showAlert,
      text: req.session.alert,
    };

    req.session.showAlert = false;

    res.locals.global = {
      "const": {
        WEB_HREF: process.WEB_HREF,
        PRODUCTION: process.PRODUCTION,
        LEVEL: UserLevel.Level
      }
    };

    const userId = jwt.get(req)?.uuid;
    const userInfo = userId ? await Account.getUserInfo(db, userId) : null;
    res.locals.global.user = userInfo?.data || null;

    next();
  }

  return { middleware }
}
