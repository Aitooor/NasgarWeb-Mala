const RCON = require("rcon");
const CONFIG = require("../../config");

function wait(ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

/**
 * 
 * @param {RCON} rcon 
 * @param {number} PORT
 */
async function rconTry(rcon, PORT) {
  await rcon.connect(CONFIG.SV_HOST, PORT, CONFIG.RCON.PASS);
      
  console.log("MC is connected on", PORT, "->", rcon.authenticated && rcon.online);

  rcon.socket.on("error", async (e) => {
    console.log(`MC ${PORT} error: `, e);
    console.log(`MC ${PORT} is reconnecting.`);
    await wait(1500);
    rconTry(rcon, PORT);
  });
}

/**
 * 
 * @param {number} PORT 
 */
async function rcon(PORT) {
  const rcon = new RCON(5000);

  await rconTry(rcon, PORT);
      
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
