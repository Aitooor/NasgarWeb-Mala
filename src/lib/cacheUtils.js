"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readFileBuffer = exports.readFile = exports.readDir = exports.mkdirIf = exports.touchIf = exports.createIf = exports.getPath = exports.exists = exports.resolvePath = exports.cacheDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.cacheDir = path_1.default.join(process.cwd(), "cache");
function resolvePath(path) {
    return path.includes(exports.cacheDir)
        ? path
        : path_1.default.join(exports.cacheDir, path);
}
exports.resolvePath = resolvePath;
function exists(path) {
    return fs_1.default.existsSync(resolvePath(path));
}
exports.exists = exists;
function getPath(path) {
    const _path = resolvePath(path);
    createIf(_path);
    return _path;
}
exports.getPath = getPath;
function createIf(path, _default = "") {
    if (exists(path))
        return;
    if (path.match(/.*\..+$/) === null) {
        mkdirIf(path);
    }
    else {
        touchIf(path, _default);
    }
}
exports.createIf = createIf;
function touchIf(_path, _default) {
    const path = resolvePath(_path);
    if (exists(path))
        return;
    mkdirIf(path_1.default.dirname(resolvePath(path)));
    writeFile(resolvePath(path), _default);
}
exports.touchIf = touchIf;
function mkdirIf(_path) {
    const path = resolvePath(_path);
    if (exists(path))
        return;
    // mkdirIf(Path.dirname(path))
    fs_1.default.mkdirSync(resolvePath(path));
}
exports.mkdirIf = mkdirIf;
function readDir(dir) {
    const path = getPath(dir);
    return fs_1.default.readdirSync(path);
}
exports.readDir = readDir;
function readFile(file) {
    return readFileBuffer(file).toString("utf8");
}
exports.readFile = readFile;
function readFileBuffer(file) {
    const path = getPath(file);
    return fs_1.default.readFileSync(path);
}
exports.readFileBuffer = readFileBuffer;
function writeFile(file, data) {
    const path = resolvePath(file);
    mkdirIf(path_1.default.dirname(resolvePath(path)));
    fs_1.default.writeFileSync(path, data);
}
exports.writeFile = writeFile;
