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
exports.getByUUID = exports.set = exports.read = exports.save = void 0;
const Utils = __importStar(require("./cacheUtils"));
const Path = __importStar(require("path"));
const file = Path.join(Utils.cacheDir, "category.json");
Utils.touchIf(file, JSON.stringify({
    lastUpdate: 0,
    categories: [],
}, undefined, 2));
function save(json) {
    Utils.writeFile(file, process.env.NODE_ENV === "production"
        ? JSON.stringify(json)
        : JSON.stringify(json, undefined, 2));
}
exports.save = save;
function read() {
    const json = Utils.readFile(file);
    return JSON.parse(json);
}
exports.read = read;
function set(...categories) {
    const oldJson = read();
    const newJson = {
        categories: Object.assign(Object.assign({}, oldJson.categories), categories),
    };
    save(newJson);
    return newJson;
}
exports.set = set;
function getByUUID(id) {
    return (read().categories[id] || null);
}
exports.getByUUID = getByUUID;
// export function getByUsername(username: string): CategoryCache {
//   for (const id in read().categories) {
//     if (Object.prototype.hasOwnProperty.call(read().categories, id)) {
//       const element = read().categories[id];
//       if(element.username === username)
//         return element
//     }
//   }
// }
