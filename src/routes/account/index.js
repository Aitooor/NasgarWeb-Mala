
const { encrypt } = require("../../lib/pass");
const uuid = require("uuid");

module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
	router.get("/login", (req, res) => {
		res.render("pags/login");
	});

	router.post("/login", async (req, res) => {
		const { username, password } = req.body;

		if(typeof username != "string" || username?.match?.(/^\s*$/) !== null ||
		   typeof password != "string" || password?.match?.(/^\s*$/) !== null ) {
			res.status(400).send("ERRBAD: Bad request.");
		}

		const pool = await db();
		const query = (await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}"`))[0];
    await pool.end();

    if(query) {
      if(query.password === encript(password)) {
		    console.log(`[ACCOUNTS] User logged: ${query.uuid}:${username}`);

        req.status(200).send("User Logged");
      } else {
        req.status(400).send("ERRICPASS: Incorrect password.");
      }
    } else {
      req.status(400).send("ERRNOUSER: User is'nt exist.");
    }

		res.sendStatus(200);
	});

	router.get("/signup", (req, res) => {
		res.render("pags/signup");
	});

	router.post("/signup", async (req, res) => {
		const { username, email, password } = req.body;
                
		if(typeof username != "string" || username?.match?.(/^\s*$/) !== null ||
		   typeof password != "string" || password?.match?.(/^\s*$/) !== null ) {
                        res.status(400).send("Bad request");
		}

		const pool = await db();
                const query = await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}" LIMIT 1`);

		if(query.length === 0) {
			const _uuid = uuid.v4();
			const query = await pool.query("INSERT INTO web.accounts SET ?", { uuid: _uuid, name: username, password: encrypt(password) });

			console.log(`[ACCOUNTS] New user register: ${_uuid}:${username} `);
      await query.end();

      return res.status(200).send("Account created succefully.");
		} else {
      await query.end();
      res.status(400).send("That name already exist!");
    }
  });
});
