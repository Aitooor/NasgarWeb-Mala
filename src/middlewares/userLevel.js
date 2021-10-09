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
        let info = (0, jwt_1.get)(request);
        console.log(info, request.cookies)
        if (info === null)
            info = { userLevel: userLevel_1.Level.Default }
        if( typeof info === "object" &&
            typeof info.userLevel === "number") {
            const uLevel = info.userLevel;
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
        // Else redirect to auth or send status
        if ((options === null || options === void 0 ? void 0 : options.redirect) !== false) {
            if (typeof (options === null || options === void 0 ? void 0 : options.authPage) === "string") {
                response.status(403).redirect(`${options.authPage}?next=${request.url}`);
            }
            else if (typeof (options === null || options === void 0 ? void 0 : options.authPage) === "function") {
                options.authPage(request, response);
            }
            else {
                response.status(403).redirect("/login");
            }
        }
        else {
            response.sendStatus(403);
        }
    };
}
exports.middleware = middleware;
