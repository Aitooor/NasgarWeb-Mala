const { Server: SocketServer, Socket, Server } = require("socket.io");
const { autoUpdate, getData } = require("./server/serverData");

/** @type {import("./socketio")} */
module.exports = async function(app) {
	const io = new SocketServer(app);
	const auto = autoUpdate(1000);
	auto.onUpdate = (data) => {
		io.in("reading_server_data").emit(data);
	}

	io.on("connect", (_socket) => {
		/** @type {Socket} */
		const socket = _socket;

		socket.on("set_reading", async (_rooms) => {
			/** @type {string[]} */
			const rooms = _rooms;

			for(let room of rooms) {
				if(room === "server_data") socket.emit("reading", {
					method: "server_data",
					data: await getData()
				})
				socket.join("reading_" + room);
			}
		});
	});

	console.log("SocketIO is connected");

	return {
		io: io
	}
}