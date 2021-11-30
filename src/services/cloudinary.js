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
exports.getAllImages = exports.deleteData = exports.getData = exports.upload = exports.configure = void 0;
const cloudinary = __importStar(require("cloudinary"));
const CONFIG = __importStar(require("../../config"));
const logger = __importStar(require("../lib/logger"));
const PREFIX = "&1;45 CLOUDINARY &0&38;5;8";
function configure() {
    cloudinary.v2.config(CONFIG.CLOUDINARY);
    logger.log(PREFIX, "Cloudinary configured");
}
exports.configure = configure;
function upload(file, options) {
    return new Promise((resolve, reject) => {
        const path = typeof file === "string" ? file : file.tempFilePath;
        cloudinary.v2.uploader.upload(path, Object.assign(Object.assign({}, options), { unique_filename: true }), (err, result) => {
            if (err) {
                logger.error(PREFIX, err);
                reject(err);
            }
            else {
                logger.log(PREFIX, result);
                resolve(result);
            }
        });
    });
}
exports.upload = upload;
function getData(publicId) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.search
            .expression(`public_id=${publicId}`)
            .execute()
            .then((res) => {
            logger.log(PREFIX, `Getted data: ${publicId}`);
            if (res.resources.length === 0) {
                return null;
            }
            resolve({
                public_id: res.resources[0].public_id,
                version: res.resources[0].version,
                url: res.resources[0].secure_url,
            });
        })
            .catch((err) => {
            logger.error(PREFIX, err);
            reject(err);
        });
    });
}
exports.getData = getData;
function deleteData(publicId) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(publicId, (err, result) => {
            if (err) {
                logger.error(PREFIX, err);
                reject(err);
            }
            else {
                logger.log(PREFIX, result);
                resolve(result);
            }
        });
    });
}
exports.deleteData = deleteData;
//#region Images
function getAllImages() {
    return new Promise((resolve, reject) => {
        cloudinary.v2.search
            .expression("folder:images/*")
            .sort_by("created_at", "desc")
            .max_results(100)
            .execute()
            .then((result) => {
            logger.log(PREFIX, "Getted all images");
            resolve(result.resources.map((r) => ({
                public_id: r.public_id,
                version: r.version,
                url: r.url,
            })));
        })
            .catch((err) => {
            logger.error(PREFIX, err);
            reject(err);
        });
    });
}
exports.getAllImages = getAllImages;
//#endregion
