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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageISO = exports.LanguageISO = exports.getLanguage = exports.DefaultLanguage = void 0;
const en_json_1 = __importDefault(require("./language/en.json"));
exports.DefaultLanguage = en_json_1.default;
function generateLanguageRegExp(iso, name) {
    return new RegExp(`${iso}(-[A-Z]{2})?|${name}`, "i");
}
const englishPattern = generateLanguageRegExp("en", "english");
const spanishPattern = generateLanguageRegExp("es", "spanish");
exports.default = getLanguage;
function getLanguage(lang) {
    return __awaiter(this, void 0, void 0, function* () {
        if (lang === "default")
            return exports.DefaultLanguage;
        if (lang.match(englishPattern))
            return en_json_1.default;
        if (lang.match(spanishPattern))
            return pollyfillLanguage(yield importLanguage("es"));
        return exports.DefaultLanguage;
    });
}
exports.getLanguage = getLanguage;
function importLanguage(str) {
    return Promise.resolve().then(() => __importStar(require(`./language/${str}.json`)));
}
function pollyfillLanguage(json) {
    let res = JSON.parse(JSON.stringify(json));
    // Pollyfill chunk
    function pollyfill_(obj, compare) {
        for (let key in compare) {
            // If both types are different then use `compare.key`
            // else pollyfill `obj.key`
            if (typeof compare[key] === typeof obj[key]) {
                if (typeof compare[key] === "object") {
                    obj[key] = pollyfill_(obj[key], compare[key]);
                }
                else {
                    continue;
                }
            }
            else {
                if (typeof compare[key] === "object") {
                    obj[key] = JSON.parse(JSON.stringify(compare[key]));
                }
                else {
                    obj[key] = compare[key];
                }
            }
        }
        return obj;
    }
    res = pollyfill_(res, en_json_1.default);
    return res;
}
var LanguageISO;
(function (LanguageISO) {
    LanguageISO["Default"] = "en-US";
    LanguageISO["English"] = "en-US";
    LanguageISO["Spanish"] = "es-ES";
})(LanguageISO = exports.LanguageISO || (exports.LanguageISO = {}));
function getLanguageISO(str) {
    if (str.match(englishPattern))
        return LanguageISO.English;
    if (str.match(spanishPattern))
        return LanguageISO.Spanish;
    return LanguageISO.Default;
}
exports.getLanguageISO = getLanguageISO;
