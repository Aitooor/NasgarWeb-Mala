
const { encrypt } = require("../../lib/pass");
const { setLevel, Level, middleware: userLevelMidd } = require("../../middlewares/userLevel");
const uuid = require("uuid");

module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
	const defaultMidd = userLevelMidd(Level.Default, {
		moreThan: false,
		redirect: true,
		authPage: (_req, res) => {
			res.render("prefabs/splash", {
				title: "Ya has iniciado sesion",
				texts: {
					text: "Ya has iniciado.",
					help: "Ya has inicado sesion."
				},
				seconds: 5
			});
		}
	});

	router.get("/login", defaultMidd, (req, res) => {
		res.render("pags/login");
	});

	router.post("/login", async (req, res) => {
		const { username, password } = req.body;

		
	});

	router.get("/signup", defaultMidd, (_req, res) => {
		res.render("pags/signup");
	});

	router.post("/signup", async (req, res) => {
		const { username, password } = req.body;
                
		if(typeof username != "string" || username?.match?.(/^\s*$/) !== null ||
		   typeof password != "string" || password?.match?.(/^\s*$/) !== null ) {
			res.status(400).send("Bad request");
		}

		const pool = db();
    const query = await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}" LIMIT 1`);

		if(query.length === 0) {
			const _uuid = uuid.v4();
			const query = await pool.query("INSERT INTO web.accounts SET ?", { uuid: _uuid, name: username, password: encrypt(password), rank: Level.User });

			console.log(`[ACCOUNTS] New user register: ${_uuid}:${username} `);
      pool.end();

      return res.status(200).send("Account created succefully.");
		} else {
			pool.end();
      res.status(400).send("That name already exist!");
    }
  });

	router.get("/logout", (req, res) => {
		setLevel(Level.Default, req, res);
		res.render("prefabs/splash", {
			title: "Cerrando sesion",
			texts: {
				text: "Sesion cerrada.",
				help: "Sesion cerrada exitosamente"
			},
			seconds: 5
		});
	});

	router.post("/logout", (req, res) => {
		setLevel(Level.Default, req, res)
		res.sendStatus(200);
	});
});
