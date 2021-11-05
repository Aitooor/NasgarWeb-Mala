"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorDesc = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["None"] = 0] = "None";
    // Account
    ErrorCode[ErrorCode["EAcInvalidArgs"] = 1] = "EAcInvalidArgs";
    // Login
    ErrorCode[ErrorCode["EAcIncorrect"] = 2] = "EAcIncorrect";
    ErrorCode[ErrorCode["EAcNoVerified"] = 3] = "EAcNoVerified";
    // Sign up
    ErrorCode[ErrorCode["EAcExists"] = 4] = "EAcExists";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
exports.default = ErrorCode;
exports.errorDesc = {
    "None": "",
    // Account
    "EAcInvalidArgs": "Invalid arguments.",
    "EAcIncorrect": "Name or password is incorrect.",
    "EAcNoVerified": "Account is not verified.",
    "EAcExists": "That name already exists."
};
