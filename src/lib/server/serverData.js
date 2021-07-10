const axios = require("axios").default;

/** @typedef {{
 *  online: boolean,
 *  players: {
 * 	  online: number,
 * 	  max: number
 *  }
 * }} serverData */
/**
 * 
 * @returns {Promise<serverData>}
 */
async function getData() {
	const p = await axios.get("https://api.mcsrvstat.us/2/nasgar.online", {
		responseType: "json"
	});
	if(p.status >= 200 && p.status <= 299) return p.data;
	else return {
		online: false,
		players: {
			online: 0,
			max: 200
		}
	}
}

function autoUpdate(time = 1000) {
	/** @type {(data: serverData) => void} */
	let onUpdate = (data) => {};
	/** @type {{
	 *   interval: NodeJS.Timer,
	 *   onUpdate(data: serverData): void
	 *   clear(): void
	 * }} */
	const r = {
		get onUpdate() {return onUpdate},
		set onUpdate(v) {
			if(typeof v === "function") onUpdate = v;
			return v;
		},
		get clear() {
			return function() {
				clearInterval(r.interval);
			}
		}
	}
	r.interval = setInterval(async () => {
		onUpdate(await getData());
	}, Math.max(time, 100));

	return r;
}


module.exports = {
	getData,
	autoUpdate
}