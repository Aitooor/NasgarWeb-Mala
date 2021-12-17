const { parse } = require("hjson");
const { readFileSync } = require("fs");
const { join } = require("path");

let general = parse(readFileSync(join(__dirname, "general.hjson"), "utf8"));

if(general.ENV === "prod") {
    const prod = parse(readFileSync(join(__dirname, "prod.hjson"), "utf8"));
    general = Object.assign(general, prod);
} else if(general.ENV === "dev") {
    const dev = parse(readFileSync(join(__dirname, "dev.hjson"), "utf8"));
    general = Object.assign(general, dev);
}

module.exports = general;

if(require.main === module) console.log(module.exports);
