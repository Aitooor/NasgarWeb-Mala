const RCON = require("rcon");
const CONFIG = require("../../config");

/**
 * 
 * @param {number} PORT 
 */
 async function rcon(PORT) {
    const rcon = new RCON();
    try {
        await rcon.connect(CONFIG.SV_HOST, PORT, CONFIG.RCON.PASS);
        
		console.log("MC is connected on", PORT, "->", rcon.authenticated && rcon.online);
        
        return rcon;
    } catch (e) {
        console.error(e);
		throw e;
    }
}

/**
 * 
 * @param  {...string} PORTS 
 */
module.exports = async function(...PORTS) {
    /** @type {RCON[]} */
    const rcons = [];
    for(let PORT of PORTS) {
        rcons.push(await rcon(parseInt(PORT)));
    }

    return rcons;
}
