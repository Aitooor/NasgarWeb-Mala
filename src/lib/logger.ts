import winston from "winston";
import Fs from "fs";
import CONFIG from "../../config";

/* If logger is not setted in process then 
 * create it and set in process. */
if (typeof process.logger === "undefined") {
  // Remove last logs [Disable]
  const PATH = `${process.cwd()}/${CONFIG.LOGGER.PATHS.DIR}/`;
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
  function formatAColor(str: string): string {
    const color = str.replace(formatAColor.reg, "");
    return "\x1b[" + color + (str.endsWith("m") ? "" : "m");
  }
  formatAColor.reg = /^\x1b\[|^&/;

  /**
   * Format a complete string searching colours.
   */
  function formatColor(str: string): string {
    return str.replace(formatColor.reg, formatAColor) + "\x1b[0m";
  }
  formatColor.reg = RegColor;

  /**
   * Format a complete string searching colours and 
   * deleting it.
   */
  function formatClearColor(str: string): string {
    return str.replace(formatClearColor.reg, "");
  }
  formatClearColor.reg = RegColor;

  /**
   * Format info of logs.
   */
  function formatInfo(str: string): string {
    return (
      (process.PRODUCTION
        ? `[${new Date()
            .toISOString()
            .replace("T", " ")
            .replace(/\.[0-9]+Z$/, "")}] `
        : "") +
      (str === "error"
        ? "&1;41&38;5;16"
        : str === "warn"
        ? "&1;43&38;5;16"
        : "&1;42") +
      ` ${str} &0`
    );
  }

  /**
   * Formatter to console (With colours)
   */
  const formatConsole: winston.Logform.Format = winston.format.printf(
    (info) => {
      return (
        `${formatColor(formatInfo(info.level))} ` + formatColor(info.message)
      );
    }
  );

  /**
   * Format to files (without colours)
   */
  const formatLog: winston.Logform.Format = winston.format.printf((info) => {
    return (
      `[${formatClearColor(formatInfo(info.level))}] ` +
      formatClearColor(info.message)
    );
  });

  const now = new Date();
  const nowF = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

  const loggerConsole = winston.createLogger({
    exitOnError: false,
    level: "silly",
    format: formatConsole,
    transports: [new winston.transports.Console()],
  });

  const loggerLog = winston.createLogger({
    exitOnError: false,
    level: "silly",
    format: formatLog,
    transports: [
      new winston.transports.File({
        filename: `${PATH}${nowF}-${CONFIG.LOGGER.PATHS.LOG}`,
      }),
    ],
  });
  const loggerError = winston.createLogger({
    exitOnError: false,
    level: "error",
    format: formatLog,
    transports: [
      new winston.transports.File({
        filename: `${PATH}${nowF}-${CONFIG.LOGGER.PATHS.ERROR}`,
        level: "error",
      }),
    ],
  });

  /* Set logger in process */
  process.logger = {
    setted: true,
    separator: " ",
    loggers: {
      console: loggerConsole,
      log: loggerLog,
      debug: loggerError,
      error: loggerError,
    },
  };

  /* Just a initial message  */
  _log(
    "error",
    [
      "",
      "++++++++++++++++++++++++++++++++++++",
      "+         Logs initialized         +",
      "++++++++++++++++++++++++++++++++++++",
      "",
    ].join("\n")
  );
}

/**
 * Format types to logs
 */
function toLog(obj: any, tab: number = 0, depth: number = 6, isObj: boolean = false): string {
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

  if (typeof obj !== "object") return "";
  if (depth <= 0) return "[Object object]";

  const keys = Object.keys(obj);
  const formated = keys.map((key) => {
    return [key, toLog(obj[key], tab + 1, depth - 1, true)];
  });

  const t = (n) => "  ".repeat(n);

  const keyRegString = /^[a-zA-Z][a-zA-Z0-9]+$/;

  return (
    "{\n" +
    formated.reduce(
      (prev: string, curr: string[], i: number, arr: string[][]) => {
        const [key, value] = curr;
        const formattedKey = keyRegString.test(key) ? key : `"${key}"`;
        return (
          prev +
          t(tab + 1) +
          `${formattedKey}: ${value}${i === arr.length - 1 ? "\n" : ",\n"}`
        );
      },
      ""
    ) +
    t(tab) +
    "}"
  );
}

/**
 * Format log
 */
function formatLog(args: any[]): string {
  const msg_: string[] = [];
  for (const arg of args) {
    msg_.push(toLog(arg));
  }

  const msg = msg_.join(process.logger.separator);

  return msg;
}

/**
 * Send msg to all loggers
 */
function _log(tag: string, msg: string) {
  const { console, log, error } = process.logger.loggers;
  console.log(tag, msg);
  log.log(tag, msg);
  error.log(tag, msg);
}

/**
 * API
 */
export function log(...args: any[]): void {
  const msg: string = formatLog(args);
  _log("info", msg);
}

if (require.main === module) {
  log(
    function myFunction() {},
    () => {},
    0,
    "Hola",
    false,
    {
      name: "Yeah",
      bool: true,
      num: 0,
      fna: () => {},
      fnm: function douj() {},
      obj: {
        name: "Yeah",
        bool: true,
        num: 0,
        fna: () => {},
        fnm: function douj() {},
      },
    },
    Symbol.for("Deah")
  );
}
