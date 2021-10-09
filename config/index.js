const { parse } = require("hjson");
const { readFileSync } = require("fs");
const { join } = require("path");

module.exports = parse(readFileSync(join(__dirname, "general.hjson"), "utf8"));

if(require.main === module) console.log(module.exports);
