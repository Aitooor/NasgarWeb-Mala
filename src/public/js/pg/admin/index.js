/** @type {HTMLDivElement} */
const bans = document.querySelector("div.recent.bans");
/** @type {HTMLDivElement} */
const bansBody = bans.querySelector("div.body");

/** @type {HTMLDivElement} */
const reports = document.querySelector("div.recent.reports");
/** @type {HTMLDivElement} */
const reportsBody = reports.querySelector("div.body");

function createRecentListElement(elementData) {
	const me = document.createElement("li");
	const user = document.createElement("div");
	const username = document.createElement("span");
	const data = document.createElement("div");
	const from = document.createElement("div");
	const time = document.createElement("div");
	const msg = document.createElement("div");

	user.className = "username";
	data.className = "data";
	from.className = "from";
	time.className = "time";
	msg.className = "msg";

	me.append(user, msg);
	user.append(username, data);
	data.append(from, time);

	username.innerText = elementData.username;
	from.innerText = elementData.reporter;
	time.innerText = elementData.timestamp;
	msg.innerText = elementData.message;

	return me;
}

/**
 * 
 * @param {HTMLDivElement} body
 */
function useFetchForList(body) {
	return async res => {
		if(!res.ok) throw new Error("404 - " + res.url);
		const json = await res.json();
		if(json.length === 0) {
			body.classList.add("not-data-error");
			return;
		}
		const ul = body.querySelector("ul");
		for(const r of json) ul.append(createRecentListElement(r));

		body.classList.add("complete");
	}
}
setTimeout(() => {
	fetch("/api/get/bans/recents", {
		credentials: "include"
	})
		.then(useFetchForList(bansBody))
		.catch(err => {
			bansBody.classList.add("not-loaded-error");
			console.error(err);
		})
	

	fetch("/api/get/reports/recents", {
		credentials: "include"
	})
		.then(useFetchForList(reportsBody))
		.catch(err => {
			reportsBody.classList.add("not-loaded-error");
			console.error(err);
		})
}, 500);