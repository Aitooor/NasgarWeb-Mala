"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.log = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("../../config"));
/* If logger is not setted in process then
 * create it and set in process. */
if (typeof process.logger === "undefined") {
    // Remove last logs [Disable]
    const PATH = `${process.cwd()}/${config_1.default.LOGGER.PATHS.DIR}/`;
    /*Fs.rmSync(PATH, {
      force: true,
      recursive: true,
    });*/
    // Regular expression to colors in string,
    // &0;255 \x1b[0;255m
    const RegColor = /(&|\x1b\[)([0-2]?[0-9]{1,2})(;([0-2]?[0-9]{1,2}))*m?/g;
    /**
     * Format colour from `&xxx` or `\x1b[xxxm` to
     * \x1b[xxxm.
     * Also called Normalizer.
     *
     * @param str Colour before format
     * @return Colour after format
     */
    function formatAColor(str) {
        const color = str.replace(formatAColor.reg, "");
        return "\x1b[" + color + (str.endsWith("m") ? "" : "m");
    }
    formatAColor.reg = /^\x1b\[|^&/;
    /**
     * Format a complete string searching colours.
     */
    function formatColor(str) {
        return str.replace(formatColor.reg, formatAColor) + "\x1b[0m";
    }
    formatColor.reg = RegColor;
    /**
     * Format a complete string searching colours and
     * deleting it.
     */
    function formatClearColor(str) {
        return str.replace(formatClearColor.reg, "");
    }
    formatClearColor.reg = RegColor;
    /**
     * Format info of logs.
     */
    function formatInfo(str) {
        return ((process.PRODUCTION
            ? `[${new Date()
                .toISOString()
                .replace("T", " ")
                .replace(/\.[0-9]+Z$/, "")}] `
            : "") +
            (str === "error"
                ? "&1;41&37"
                : str === "warn"
                    ? "&1;43&38;5;16"
                    : "&1;42&38;5;16") +
            ` ${str} `);
    }
    /**
     * Formatter to console (With colours)
     */
    const formatConsole = winston_1.default.format.printf((info) => {
        return (`${formatColor(formatInfo(info.level) + "&38;5;16&48;5;16|&0")}` + formatColor(info.message));
    });
    /**
     * Format to files (without colours)
     */
    const formatLog = winston_1.default.format.printf((info) => {
        return (`[${formatClearColor(formatInfo(info.level))}] ` +
            formatClearColor(info.message));
    });
    const now = new Date();
    const nowF = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
    const logger = winston_1.default.createLogger({
        exitOnError: false,
        handleExceptions: true,
        transports: [
            new winston_1.default.transports.Console({
                format: formatConsole,
                level: "silly",
            }),
            new winston_1.default.transports.File({
                filename: `${PATH}${nowF}-${config_1.default.LOGGER.PATHS.LOG}`,
                format: formatLog,
                level: "silly",
            }),
            new winston_1.default.transports.File({
                filename: `${PATH}${nowF}-${config_1.default.LOGGER.PATHS.ERROR}`,
                format: formatLog,
                level: "error",
            }),
        ],
    });
    /* Set logger in process */
    process.logger = {
        setted: true,
        separator: " ",
        loggers: logger,
    };
    /* Just a initial message  */
    _log("error", [
        "",
        "         ╔─═─═─═─═─═─═─═─═──═─═─═─═─═─═─═─═─╗",
        "         ║         Logs initialized         ║",
        "         ╚─═─═─═─═─═─═─═─═──═─═─═─═─═─═─═─═─╝",
        "",
    ].join("\n"));
}
/**
 * Format types to logs
 */
function toLog(obj, tab = 0, depth = 6, isObj = false) {
    switch (typeof obj) {
        case "object":
            break;
        case "function":
            return `&34<Function ${obj.name.length === 0 ? "anonymus" : obj.name}>&0`;
        case "number":
        case "bigint":
            return `&32${obj}&0`;
        case "boolean":
            return `&33${obj}&0`;
        case "symbol":
            return `&34<Symbol ${obj.toString()}>&0`;
        case "string":
            return isObj ? `&33"${obj}"&0` : obj;
        default:
            return obj + "";
    }
    if (typeof obj !== "object")
        return "";
    if (depth <= 0)
        return "[Object object]";
    const keys = Object.keys(obj);
    const formated = keys.map((key) => {
        return [key, toLog(obj[key], tab + 1, depth - 1, true)];
    });
    const t = (n) => "  ".repeat(n);
    const keyRegString = /^[a-zA-Z][a-zA-Z0-9]+$/;
    return ("{\n" +
        formated.reduce((prev, curr, i, arr) => {
            const [key, value] = curr;
            const formattedKey = keyRegString.test(key) ? key : `"${key}"`;
            return (prev +
                t(tab + 1) +
                `${formattedKey}: ${value}${i === arr.length - 1 ? "\n" : ",\n"}`);
        }, "") +
        t(tab) +
        "}");
}
/**
 * Format log
 */
function formatLog(args) {
    const msg_ = [];
    for (const arg of args) {
        msg_.push(toLog(arg));
    }
    const msg = msg_.join(process.logger.separator);
    return msg;
}
/**
 * Send msg to all loggers
 */
function _log(tag, msg) {
    process.logger.loggers.log(tag, msg);
}
/**
 * API
 * Format General
 */
function log(...args) {
    const msg = formatLog(args);
    _log("info", msg);
}
exports.log = log;
/**
 * API
 * Format General
 */
function warn(...args) {
    const msg = formatLog(args);
    _log("warn", msg);
}
exports.warn = warn;
function error(...args) {
    const msg = formatLog(args.map((_) => _ instanceof Error ? _.stack || `${_.name}: ${_.message}` : _));
    _log("error", msg);
}
exports.error = error;
if (require.main === module) {
    log(function myFunction() { }, () => { }, 0, "Hola", false, {
        name: "Yeah",
        bool: true,
        num: 0,
        fna: () => { },
        fnm: function douj() { },
        obj: {
            name: "Yeah",
            bool: true,
            num: 0,
            fna: () => { },
            fnm: function douj() { },
        },
    }, Symbol.for("Deah"));
}
