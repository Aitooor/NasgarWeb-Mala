import winston from "winston";
import Fs from "fs";
import CONFIG from "../../config";

if (typeof process.logger === "undefined") {
  const PATH = `${process.cwd()}/${CONFIG.LOGGER.PATHS.DIR}/`;
  Fs.rmSync(PATH, {
    force: true,
    recursive: true,
  });

  const RegColor = /(&|\x1b\[)([0-2]?[0-9]{1,2})(;([0-2]?[0-9]{1,2}))*m?/g;
  function formatAColor(str: string): string {
    const color = str.replace(formatAColor.reg, "");
    return "\x1b[" + color + (str.endsWith("m") ? "" : "m");
  }
  formatAColor.reg = /^\x1b\[|^&/;

  function formatColor(str: string): string {
    return str.replace(formatColor.reg, formatAColor) + "\x1b[0m";
  }
  formatColor.reg = RegColor;

  function formatClearColor(str: string): string {
    return str.replace(formatClearColor.reg, "");
  }
  console.log(RegColor.source);

  formatClearColor.reg = new RegExp(RegColor.source + "m?", "g");

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

  const formatConsole: winston.Logform.Format = winston.format.printf(
    (info) => {
      return (
        `${formatColor(formatInfo(info.level))} ` + formatColor(info.message)
      );
    }
  );

  const formatLog: winston.Logform.Format = winston.format.printf((info) => {
    return (
      `[${formatClearColor(formatInfo(info.level))}] ` +
      formatClearColor(info.message)
    );
  });

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
        filename: `${PATH}${CONFIG.LOGGER.PATHS.LOG}`,
      }),
    ],
  });
  const loggerError = winston.createLogger({
    exitOnError: false,
    level: "error",
    format: formatLog,
    transports: [
      new winston.transports.File({
        filename: `${PATH}${CONFIG.LOGGER.PATHS.ERROR}`,
        level: "error",
      }),
    ],
  });

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

function toLog(obj: any, tab: number = 0, depth: number = 6): string {
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
      return `&33"${obj}"&0`;

    default:
      return obj + "";
  }

  if (typeof obj !== "object") return "";
  if (depth <= 0) return "[Object object]";

  const keys = Object.keys(obj);
  const formated = keys.map((key) => {
    return [key, toLog(obj[key], tab + 1, depth - 1)];
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

function formatLog(...args: any[]): string {
  const msg_: string[] = [];
  for (const arg of args) {
    switch (typeof arg) {
      case "function":
        const v1: Function = arg;
        msg_.push(
          `&34<Function ${v1.name.length === 0 ? "anonymus" : v1.name}>&0`
        );
        break;

      case "number":
      case "bigint":
        const v2: Number | BigInt = arg;
        msg_.push(`&32${v2}&0`);
        break;

      case "boolean":
        const v3: Boolean = arg;
        msg_.push(`&33${v3}&0`);
        break;

      case "symbol":
        const v4: Symbol = arg;
        msg_.push(`&34<Symbol ${v4.toString()}>&0`);
        break;

      case "object":
        msg_.push(toLog(arg));
        break;

      default:
        msg_.push(arg);
        break;
    }
  }

  const msg = msg_.join(process.logger.separator);

  return msg;
}

function _log(tag: string, msg: string) {
  process.logger.loggers.console.log(tag, msg);
  process.logger.loggers.log.log(tag, msg);
  process.logger.loggers.error.log(tag, msg);
}

export function log(...args: any[]): void {
  const msg: string = formatLog(...args);
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
