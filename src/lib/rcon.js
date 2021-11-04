const RCON = require("rcon");
const CONFIG = require("../../config");
const logger = require("../lib/logger")


const disabled = {
  "default": !process.PRODUCTION
};
const PREFIX = (id = "") => `&0;41;1 RCON(${id}) &0&38;5;8`;

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
      
  logger.log(PREFIX(PORT), "Is connected on", PORT, "-> &0", rcon.authenticated && rcon.online);

  rcon.socket.on("error", async (e) => {
    logger.log(PREFIX(PORT), `Error: `, e);
    logger.log(PREFIX(PORT), `Is reconnecting.`);
    await wait(1500);
    rconTry(rcon, PORT);
  });
}

/**
 * 
 * @param {number} PORT 
 */
async function rcon(PORT) {
  const rcon = new RCON(5_000);
  logger.log(PREFIX(PORT), "Connecting.");

  if(disabled[PORT.toString()] ?? disabled.default) 
    logger.log(PREFIX(PORT), "&0;31Is disabled!!");
  else 
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
