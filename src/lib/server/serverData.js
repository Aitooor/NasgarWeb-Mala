const axios = require("axios").default;

let maintenance = true;
/**
 * 
 * @param {() => import("mysql").Pool} db
 * @returns {Boolean}
 */
async function reloadMaintenance(db) {
	return true;
	try {
		const pool = db();
		const query = (await pool.query("Select * from bungee.maintenance_settings"))[0];
		await pool.end();
		maintenance = Boolean(query.value);
		return maintenance;
	} catch (err) {
		console.error(err);
	}
}

/** @typedef {{
 *  online: boolean,
 *  players: {
 * 	  online: number,
 * 	  max: number
 *  }
 * }} serverData */
/**
 * @returns {Promise<serverData>}
 */
async function getData() {
	const p = await axios.get("https://api.mcsrvstat.us/2/nasgar.online", {
		responseType: "json",
		withCredentials: false,
		headers: {
			"Cache-Control": "no-cache"
		}
	});

	if(p.status >= 200 && p.status <= 299) return {...p.data, maintenance}
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
	};

	r.interval = setInterval(async () => {
		await reloadMaintenance(db);
		r.onUpdate(await getData());
	}, Math.max(time, 100));

	return r;
}


module.exports = {
	getData,
	reloadMaintenance,
	autoUpdate
}