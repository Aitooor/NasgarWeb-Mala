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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const Language = __importStar(require("../../config/language"));
exports.default = middleware;
function middleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let lang = Language.DefaultLanguage;
        let langISO = Language.LanguageISO.Default;
        if (typeof req.query.lang === "string") {
            langISO = Language.getLanguageISO(req.query.lang);
            lang = yield Language.getLanguage(langISO);
        }
        else if (typeof req.headers["accept-language"] === "string") {
            langISO = Language.getLanguageISO(req.headers["accept-language"]);
            lang = yield Language.getLanguage(langISO);
        }
        res.locals.global = {
            lang,
            langISO
        };
        next();
    });
}
exports.middleware = middleware;
;
