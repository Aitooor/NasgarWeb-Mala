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
exports.RedisClient = void 0;
const redis_1 = __importDefault(require("../services/redis"));
const CONFIG = __importStar(require("../../config"));
class RedisClient {
    constructor() {
        this.redis = new redis_1.default({
            host: CONFIG.SV_HOST,
            port: CONFIG.REDIS.PORT,
            password: CONFIG.REDIS.PASS,
            channel: CONFIG.REDIS.CHANNEL
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.connect();
        });
    }
    publish(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.publish(channel, message);
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.send(message);
        });
    }
}
exports.RedisClient = RedisClient;
exports.default = RedisClient;
