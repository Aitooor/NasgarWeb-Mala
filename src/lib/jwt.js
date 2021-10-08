"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.verify = exports.set = exports.add = exports.put = exports.decode = exports.generate = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const CONFIG = __importStar(require("../../config"));
/**
 * Generate new token
 */
function generate(json) {
    return jwt.sign(json, CONFIG.JWT);
}
exports.generate = generate;
/**
 * Verify jwt token and decode it
 */
function decode(token) {
    try {
        return jwt.verify(token, CONFIG.JWT, {
            complete: false
        });
    }
    catch (_a) {
        return null;
    }
}
exports.decode = decode;
/**
 * Clear and Set token to new `json`
 */
function put(json, res) {
    const str = generate(json);
    res.cookie("nasgar", str, { maxAge: 9999999, httpOnly: true });
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
    if (typeof req.cookies.nasgar === "string")
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
        json: true,
        complete: false
    });
}
exports.get = get;
