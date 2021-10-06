"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.generateMessageID = exports.MessageIDType = void 0;
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTransport = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: config_1.default.EMAIL_AUTH
});
var MessageIDType;
(function (MessageIDType) {
    MessageIDType[MessageIDType["None"] = 0] = "None";
    MessageIDType[MessageIDType["Verification"] = 1] = "Verification";
    MessageIDType[MessageIDType["News"] = 2] = "News";
    MessageIDType[MessageIDType["Offers"] = 3] = "Offers";
})(MessageIDType = exports.MessageIDType || (exports.MessageIDType = {}));
/**
 * Generate a message ID to email from some parameters
 */
function generateMessageID(options) {
    const uuid = (0, uuid_1.v4)().toLowerCase();
    const type = (options === null || options === void 0 ? void 0 : options.type) || 0;
    return `<type-${type}+${uuid}@nasgarnetwork>`;
}
exports.generateMessageID = generateMessageID;
function sendEmail(emailOptions) {
    return new Promise((res, rej) => {
        const messageId = (typeof emailOptions.messageID !== undefined ?
            typeof emailOptions.messageID === "string" ?
                emailOptions.messageID :
                generateMessageID(emailOptions.messageID) :
            generateMessageID({
                type: MessageIDType.None
            }));
        const rawEmailOptions = {
            to: emailOptions.to,
            subject: emailOptions.subject,
            text: emailOptions.text || "",
            html: emailOptions.html || undefined,
            priority: emailOptions.priority || "normal",
            messageId: messageId
        };
        emailTransport.sendMail(Object.assign(rawEmailOptions, emailOptions.raw || {}), (err, info) => {
            if (err)
                rej(err);
            if (emailOptions.seeInfo) {
                console.log(info);
            }
            res(messageId);
        });
    });
}
exports.sendEmail = sendEmail;
;
exports.default = sendEmail;
