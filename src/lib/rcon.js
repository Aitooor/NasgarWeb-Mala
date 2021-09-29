const RCON = require("rcon");
const CONFIG = require("../../config");

function wait(ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

/**
 * 
 * @param {number} PORT 
 */
async function rcon(PORT) {
  const rcon = new RCON(5000);
    
  await rcon.connect(CONFIG.SV_HOST, PORT, CONFIG.RCON.PASS);
      
  console.log("MC is connected on", PORT, "->", rcon.authenticated && rcon.online);

  rcon.onError(async (e) => {
    console.log(`MC ${PORT} error: `, e);
    console.log(`MC ${PORT} is reconnecting.`);
    await wait(1500);
    await rcon.connect(CONFIG.SV_HOST, PORT, CONFIG.RCON.PASS);
    console.log("MC is connected on", PORT, "->", rcon.authenticated && rcon.online);
  });
      
  return rcon;
}

/**
 * 
 * @param  {...number} PORTS 
 */
module.exports = async function(...PORTS) {
    /** @type {RCON[]} */
    const rcons = [];
    for(let PORT of PORTS) {
        rcons.push(await rcon(PORT));
    }

    return rcons;
}
