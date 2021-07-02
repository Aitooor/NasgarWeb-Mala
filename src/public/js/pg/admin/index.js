/** @type {HTMLDivElement} */
const bans = document.querySelector("div.recent.bans");
/** @type {HTMLDivElement} */
const bansBody = bans.querySelector("div.body");

/** @type {HTMLDivElement} */
const reports = document.querySelector("div.recent.reports");
/** @type {HTMLDivElement} */
const reportsBody = reports.querySelector("div.body");

setTimeout(() => {
	fetch("/api/get/bans/recents", {
		credentials: "include"
	})
		.then(res => (res.json()))
		.then(res => {
			const ul = bansBody.querySelector("ul");
			for(const ban of res) {
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

				username.innerText = ban.username;
				from.innerText = ban.reporter;
				time.innerText = ban.timestamp;
				msg.innerText = ban.message;

				ul.append(me);
			}

			bansBody.classList.add("complete");
		})
		.catch(err => {
			bansBody.classList.add("not-loaded-error");
			console.error(err);
		})
	

	fetch("/api/get/reports/recents", {
		credentials: "include"
	})
		.then(res => (res.json()))
		.then(res => {
			const ul = reportsBody.querySelector("ul");
			for(const ban of res) {
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

				username.innerText = ban.username;
				from.innerText = ban.reporter;
				time.innerText = ban.timestamp;
				msg.innerText = ban.message;

				ul.append(me);
			}

			reportsBody.classList.add("complete");
		})
		.catch(err => {
			reportsBody.classList.add("not-loaded-error");
			console.error(err);
		})
}, 500);