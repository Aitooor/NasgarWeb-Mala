document.querySelector(".banner-discord").onclick = () => {window.open("https://discord.gg/PJk9uyhv6S", "_blank")};

/** @type {HTMLDivElement} */
const membersCard = document.querySelector(".card-members");
/** @type {{
 *   status: HTMLDivElement,
 *   liveBlob: HTMLDivElement,
 *   onlineMembers: HTMLDivElement,
 *   onlinePlayers: HTMLSpanElement,
 * }} */
const membersCardElements = {
	status: membersCard.querySelector(".header > .status"),
	onlineMembers: membersCard.querySelector(".body > .online-members"),
}

membersCardElements.onlinePlayers = membersCardElements.onlineMembers.querySelector("span.players");

/** @type {import("socket.io-client").Socket} */
const socket = io();

socket.on("connect", () => {
	console.log("Socket: Connected");
	socket.emit("set_reading", ["server_data"]);

	socket.on("reading", data => {
		console.log(data);
		if(data.data.online) {
			if(data.data.maintenance) membersCardElements.status.classList.add("mantent");
			else 					  membersCardElements.status.classList.add("online");
			membersCardElements.onlinePlayers.innerText = `${data.data.players.online}/${data.data.players.max}`;
		} else {
			membersCardElements.status.classList.add("online");
			membersCardElements.onlinePlayers.innerText = `0/${data.data.players.max}`;
		}
	})
})

socket.connect();

globalThis.socket = socket;