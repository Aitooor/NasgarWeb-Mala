
const { createHmac } = require("crypto");
const CONFIG = require("../../config");

function encrypt(pass) {
	return createHmac("sha256", CONFIG.PASS_KEY)
		.update(pass)
		.digest("hex");
}

exports = module.exports = {
	encrypt
}

exports.default = exports;
