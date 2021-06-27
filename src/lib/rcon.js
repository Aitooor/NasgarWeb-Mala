const RCON = require("rcon");

/**
 * 
 * @param {number} PORT 
 */
 async function rcon(PORT) {
    const rcon = new RCON();
    try {
        await rcon.connect(process.env.SV_HOST, PORT, process.env.RCON_PASS);
		console.log("MC is connected on", PORT);
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