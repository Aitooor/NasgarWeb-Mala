const axios = require("axios").default;

/** @typedef {{
 *  online: boolean,
 *  players: {
 * 	  online: number,
 * 	  max: number
 *  }
 * }} serverData */
/**
 * @param {() => import("mysql").Pool} db
 * @returns {Promise<serverData>}
 */
async function getData(db) {

	const pool = db();
	const query = (await pool.query("Select * from bungee.maintenance_settings"))[0];

	const p = await axios.get("https://api.mcsrvstat.us/2/nasgar.online", {
		responseType: "json"
	});
	if(p.status >= 200 && p.status <= 299) return {...p.data, maintenance: query.value ? true : false}
	else return {
		online: false,
		maintenance: false,
		players: {
			online: 0,
			max: 200
		}
	}
}

function autoUpdate(time = 1000, db) {
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
		onUpdate(await getData(db));
	}, Math.max(time, 100));

	return r;
}


module.exports = {
	getData,
	autoUpdate
}