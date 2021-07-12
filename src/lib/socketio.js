const { Server: SocketServer, Socket } = require("socket.io");
const { autoUpdate, getData, reloadMaintenance } = require("./server/serverData");

/** @type {import("./socketio")} */
module.exports = async function(app, db) {
	const io = new SocketServer(app);
	const auto = autoUpdate(50_000, db);
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
				socket.join("reading_" + room);

				if(room === "server_data") {
					await reloadMaintenance(db);
					io.in("reading_server_data").emit("reading", {
						method: "server_data",
						data: await getData()
					});
				}
			}
		});
	});

	console.log("SocketIO is connected");

	return {
		io: io
	}
}