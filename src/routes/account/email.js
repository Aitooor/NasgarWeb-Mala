const jwt = require("../../lib/jwt")

module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcon) => {
	router.get("/api/accounts/verify", async (req, res) => {
		const _uuid = req.query.uuid;
		const uuid = jwt.decode(_uuid);

		if(typeof uuid !== "string" || uuid === "")
			return res
				.status(400)
				.render("prefabs/splash", {
					title: "Verificación invalida",
					texts: {
						text: "Verificación invalida.",
						help: "El parametro uuid no es valido."
					},
					seconds: 5
				});

		const pool = db();

		const query = await pool.query("SELECT * FROM web.accounts WHERE uuid = ? LIMIT 1", [uuid]);

		if(query.length === 0) {
			pool.end();

			return res
				.status(400)
				.render("prefabs/splash", {
					title: "Verificación invalida",
					texts: {
						text: "Verificación invalida.",
						help: "Inserta correctamente la uuid o contactanos."
					},
					seconds: 5
				});
		}

		await pool.query("UPDATE web.accounts SET emailVerified = 1 WHERE uuid = ?", [uuid]);

		pool.end();

		jwt.set({ userLevel: query.userLevel }, req, res);

		res.render("prefabs/splash", {
			title: "Verificación completada",
			texts: {
				text: "Verificación completada."
			},
			seconds: 5
		});
	});
});
