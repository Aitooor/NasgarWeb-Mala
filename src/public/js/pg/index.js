document.querySelector(".banner-discord").onclick = () => {window.open("https://discord.gg/PJk9uyhv6S", "_blank")};
/*
<div class="card-members">
	<div class="header">
		<div>Nasgar Network</div>
		<div class="status"></div>
	</div>

	<div class="body">
		<div class="online-members">
			<span>
				0/0 <div class="blob-live disabled"></div>
			</span>
		</div>
	</div>
</div>
*/
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

membersCardElements.liveBlob = membersCardElements.onlineMembers.querySelector("div.blob-live");
membersCardElements.onlinePlayers = membersCardElements.onlineMembers.querySelector("span.players");

/** @type {import("socket.io-client").Socket} */
const socket = io();

socket.on("connect", () => {
	console.log("Socket: Connected");
	socket.emit("set_reading", ["server_data"]);

	socket.on("reading", data => {
		console.log(data);
		membersCardElements.status.classList.add("online");
		membersCardElements.liveBlob.classList.remove("disabled");
		membersCardElements.onlinePlayers.innerText = `${data.data.players.online}/${data.data.players.max}`;
	})
})

socket.connect();

globalThis.socket = socket;