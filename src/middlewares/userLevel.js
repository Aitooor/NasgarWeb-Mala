"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.setLevel = exports.Level = void 0;
const userLevel_1 = require("../@types/userLevel");
const jwt_1 = require("../lib/jwt");
exports.Level = userLevel_1.Level;
function setLevel(level, req, res) {
    (0, jwt_1.add)({ userLevel: level }, req, res);
}
exports.setLevel = setLevel;
exports.default = middleware;
function middleware(levels, options) {
    return (request, response, next) => {
        // If it has nasgar.userLevel then continue
        const info = (0, jwt_1.get)(request);
        if (info !== null &&
            typeof info === "object" &&
            typeof info.userLevel === "number") {
            const uLevel = info.userLevel;
            // Normalize to array
            if (!Array.isArray(levels))
                levels = [levels];
            if ((options === null || options === void 0 ? void 0 : options.moreThan) !== false) {
                const min = Math.min(...levels);
                if (uLevel >= min)
                    if (Array.isArray(options === null || options === void 0 ? void 0 : options.exclude) &&
                        !options.exclude.includes(uLevel))
                        return next();
                    else
                        return next();
            }
            else {
                if (levels.includes(uLevel))
                    if (Array.isArray(options === null || options === void 0 ? void 0 : options.exclude) &&
                        !options.exclude.includes(uLevel))
                        return next();
                    else
                        return next();
            }
        }
        else if (info === null && (levels === exports.Level.Default || (Array.isArray(levels) && levels.includes(exports.Level.Default)))) {
            return next();
        }
        // Else redirect to auth or send status
        if ((options === null || options === void 0 ? void 0 : options.redirect) !== false) {
            const query = "next=" + encodeURIComponent(request.originalUrl);
            if (typeof (options === null || options === void 0 ? void 0 : options.authPage) === "string") {
                response.redirect(`${options.authPage}?${query}`);
            }
            else if (typeof (options === null || options === void 0 ? void 0 : options.authPage) === "function") {
                request.query = {
                    next: request.originalUrl
                };
                options.authPage(request, response);
            }
            else {
                response.redirect(`/login?${query}`);
            }
        }
        else {
            response.sendStatus(403);
        }
    };
}
exports.middleware = middleware;
