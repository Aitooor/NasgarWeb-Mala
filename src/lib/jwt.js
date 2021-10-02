"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.verify = exports.set = exports.add = exports.put = exports.generate = void 0;
const jwt = require("jsonwebtoken");
const CONFIG = require("../../config");
/**
 * Generate new token
 */
function generate(json) {
    return jwt.sign(json, CONFIG.JWT);
}
exports.generate = generate;
/**
 * Clear and Set token to new `json`
 */
function put(json, res) {
    const str = generate(json);
    res.cookie("nasgar", str, { httpOnly: true });
    return str;
}
exports.put = put;
/**
 * Add or Set the props on `json`
 */
function add(json, req, res) {
    const g = get(req);
    if (g === null) {
        return put(json, res);
    }
    else {
        return put(Object.assign(Object.assign({}, g), json), res);
    }
}
exports.add = add;
exports.set = add;
/**
 * Verify token
 */
function verify(req) {
    if (typeof req.cookies.nasgar === "string" && req.cookies.nasgar.length !== 0)
        try {
            jwt.verify(req.cookies.nasgar, CONFIG.JWT);
            return true;
        }
        catch (_a) {
            return false;
        }
    return false;
}
exports.verify = verify;
/**
 * Get info of token
 */
function get(req) {
    if (!verify(req))
        return null;
    return jwt.decode(req.cookies.nasgar, {
        json: true
    });
}
exports.get = get;
