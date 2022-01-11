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
exports.Redis = void 0;
const NodeRedis = __importStar(require("redis"));
const logger = __importStar(require("../lib/logger"));
var ERRORS;
(function (ERRORS) {
    ERRORS["ENOINIT"] = "Redis not initialized";
    ERRORS["ECONNECT"] = "Redis connection error";
})(ERRORS || (ERRORS = {}));
class Redis {
    constructor(settings) {
        this._settings = settings;
        // @ts-expect-error - modules is not exported
        this._client = NodeRedis.createClient({
            url: `redis://${this._settings.host}:${this._settings.port}`,
            password: this._settings.password,
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._client) {
                throw new Error(ERRORS.ENOINIT);
            }
            try {
                yield this._client.connect();
                logger.log("Redis connected");
            }
            catch (err) {
                logger.error(err);
                throw err;
            }
        });
    }
    /**
     *
     * @returns  All clients that received the message
     */
    publish(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log(`Publishing message to channel ${channel}: ${message}`);
            return yield this._client.publish(channel, message);
        });
    }
    /**
     *
     * @returns All clients that received the message
     */
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._client) {
                throw new Error(ERRORS.ENOINIT);
            }
            if (!this._settings.channel) {
                throw new Error(ERRORS.ENOINIT);
            }
            try {
                return yield this.publish(this._settings.channel, message);
            }
            catch (e) {
                logger.error(ERRORS.ECONNECT);
            }
        });
    }
}
exports.Redis = Redis;
exports.default = Redis;
