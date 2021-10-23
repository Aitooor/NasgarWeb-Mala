const RCON = require("rcon");
const CONFIG = require("../../config");

const disabled = {
  "default": false
};
const PREFIX = (id = "") => `\x1b[0;31;1m[RCON(${id})] \x1b[0m\x1b[38;5;8m`;

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
      
  console.log(PREFIX(PORT) + "Is connected on", PORT, "->", rcon.authenticated && rcon.online);

  rcon.socket.on("error", async (e) => {
    console.log(PREFIX(PORT) + `Error: `, e);
    console.log(PREFIX(PORT) + `Is reconnecting.`);
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
  console.log(PREFIX(PORT) + "Connecting.\x1b[0m");

  if(disabled[PORT.toString()] ?? disabled.default) 
    console.log(PREFIX(PORT) + "\x1b[0;31mIs disabled!!\x1b[0m");
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
