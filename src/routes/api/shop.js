const { StaffMiddleware } = require("../../middlewares/staff");
const { timeago } = require("../../utils");
const shop = require("../../lib/shop");

/**
 * 
 * @param {import("express").Express} app 
 * @param {() => import("mysql").Pool} db
 */
module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
	router.get("/get/bans/recents", StaffMiddleware, async (_req, res) => {
		/** @type {Array<any>} */
		const dataCrude = await (db()).query("SELECT * FROM bungee.PunishmentHistory;");

		const data = [];
		dataCrude.reverse().forEach(v => {
			const now = new Date();
			const times = parseInt(v.end != "-1" ? v.start : v.end);
			const time = new Date(times);
			if((now.getMonth() - time.getMonth() > 0) || (now.getFullYear() - time.getFullYear() > 0)) return;
			if(!(v.punishmentType === "BAN" || v.punishmentType === "TEMP_BAN" || v.punishmentType === "IP_BAN")) return;	
			data.push({
				username: v.name,
				reporter: `${v.punishmentType.replace("_", " ")} - ${v.operator}`,
				message: v.reason,
				timestamp: timeago(new Date(parseInt(v.start))) + (v.end != "-1" ? " - " + timeago(new Date(parseInt(v.end))) : "")
			});
		});

		res
			.type("json")
			.send(data);
	});

	router.post("/add/product", async (req, res) => {
		try {
			if(await shop.addProduct(db, req.body))
				res.sendStatus(200);
			else
				res.sendStatus(400);
		} catch {
			res.sendStatus(500);
		}
	});

	router.post("/delete/product", async (req, res) => {
		if(req.body.confirmation !== "DELETE") {
			res.status(400).send("Invalid confirmation.")
			return;
		}

		try {
			if(await shop.delProduct(db, req.body.uuid))
				res.sendStatus(200);
			else 
				res.sendStatus(400);
		} catch {
			res.sendStatus(500);
		}
	});

	router.post("/update/product", async (req, res) => {
		try {
			if(await shop.updateProduct(db, req.body)) 
				res.sendStatus(200);
			else 
				res.sendStatus(400);
		} catch {
			res.status(500).send({ error: "Internal Server Error" });
		}
	});

	router.get("/get/products", async (_req, res) => {
		res.status(200).send(await shop.getAllProducts(db));
	});

	router.get("/get/products/:category", async (req, res) => {
		res.status(200).send(await shop.getAllProductsFrom(db, req.params.category));
	});

	router.get("/get/product/:uuid", async (req, res) => {
		/** @type {any} */
    let _res = { error: "ERRNOUUID: Bad uuid" };
    let status = 400;
    const uuid = req.params.uuid;
        
    try {
      const json = await shop.getProduct(db, uuid);
          
      _res = json;
      status = 200;
    } catch {};

    res.type("json").status(status).send(_res);
	});

  router.post("/get-cupon", async (req, res) => {
    let { cupon } = req.body;

    if(typeof cupon !== "string") 
      return res.status(400).send({ cupon, valid: false });

    res.status(200).send(await shop.getCupon(db, cupon));
  });
})
