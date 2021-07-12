const RCON = require("rcon");

/**
 * 
 * @param {number} PORT 
 */
 async function rcon(PORT) {
    const rcon = new RCON();
    try {
        await rcon.connect(process.env.SV_HOST, PORT, process.env.RCON_PASS);
        
		console.log("MC is connected on", PORT, "->", rcon.authenticated);
        rcon.send(`tellraw @a ["",{"text":">>","color":"dark_gray"},{"text":" Quiralte234","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"Normal Key x5","color":"light_purple"},{"text":".","color":"gray"}]`);
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