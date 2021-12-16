const { StaffMiddleware } = require("../../middlewares/staff");
const { timeago } = require("../../utils");
const shop = require("../../lib/shop");
const cacheCategory = require("../../lib/cacheCategory");
const logger = require("../../lib/logger");
const { v4: uuidv4 } = require("uuid");
const CONFIG = require("../../../config");
const webTable = CONFIG.DB.web;

/**
 *
 * @param {import("express").Express} app
 * @param {() => import("mysql").Pool} db
 */
module.exports = require("../../lib/Routes/exports")(
  "/",
  (router, waRedirect, db, rcons) => {
    router.get("/get/bans/recents", StaffMiddleware, async (_req, res) => {
      /** @type {Array<any>} */
      const dataCrude = await db().query(
        "SELECT * FROM bungee.PunishmentHistory;"
      );

      const data = [];
      dataCrude.reverse().forEach((v) => {
        const now = new Date();
        const times = parseInt(v.end != "-1" ? v.start : v.end);
        const time = new Date(times);
        if (
          now.getMonth() - time.getMonth() > 0 ||
          now.getFullYear() - time.getFullYear() > 0
        )
          return;
        if (
          !(
            v.punishmentType === "BAN" ||
            v.punishmentType === "TEMP_BAN" ||
            v.punishmentType === "IP_BAN"
          )
        )
          return;
        data.push({
          username: v.name,
          reporter: `${v.punishmentType.replace("_", " ")} - ${v.operator}`,
          message: v.reason,
          timestamp:
            timeago(new Date(parseInt(v.start))) +
            (v.end != "-1" ? " - " + timeago(new Date(parseInt(v.end))) : ""),
        });
      });

      res.type("json").send(data);
    });

    //#region Products

    router.post("/add/product", async (req, res) => {
      try {
        if (await shop.addProduct(db, req.body)) res.sendStatus(200);
        else res.sendStatus(400);
      } catch {
        res.sendStatus(500);
      }
    });

    router.post("/delete/product", async (req, res) => {
      if (req.body.confirmation !== "DELETE") {
        res.status(400).send("Invalid confirmation.");
        return;
      }

      try {
        if (await shop.delProduct(db, req.body.uuid)) res.sendStatus(200);
        else res.sendStatus(400);
      } catch {
        res.sendStatus(500);
      }
    });

    router.post("/update/product", async (req, res) => {
      try {
        if (await shop.updateProduct(db, req.body)) res.sendStatus(200);
        else res.sendStatus(400);
      } catch {
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    router.get("/get/products", async (_req, res) => {
      res.status(200).send(await shop.getAllProducts(db));
    });

    router.get("/get/products/:category", async (req, res) => {
      res
        .status(200)
        .send(await shop.getAllProductsFrom(db, req.params.category));
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
      } catch {}

      res.type("json").status(status).send(_res);
    });

    //#endregion

    router.post("/get-cupon", async (req, res) => {
      let { cupon } = req.body;

      if (typeof cupon !== "string")
        return res.status(400).send({ cupon, valid: false });

      res.status(200).send(await shop.getCupon(db, cupon));
    });

    /****************************************/
    /***            Categories            ***/
    /****************************************/

    //#region Categories

    router.get("/shop/categories", async (_req, res) => {
      res.status(200).send(await shop.getAllCategories(db));
    });

    router.get("/shop/category/:uuid", async (req, res) => {
      /** @type {any} */
      let _res = { error: "ERRNOUUID: Bad uuid" };
      let status = 400;
      const uuid = req.params.uuid;

      try {
        const json = await shop.getCategory(db, uuid);

        _res = json;
        status = 200;
      } catch {}

      res.type("json").status(status).send(_res);
    });

    router.post("/shop/category", async (req, res) => {
      try {
        if (await shop.addCategory(db, req.body)) {
          await updateCategoryCache();
          res.sendStatus(200);
        } else res.sendStatus(400);
      } catch {
        res.sendStatus(500);
      }
    });

    router.put("/shop/category", async (req, res) => {
      try {
        if (await shop.updateCategory(db, req.body, req.body.uuid)) {
          await updateCategoryCache();
          res.sendStatus(200);
        } else res.sendStatus(400);
      } catch (err) {
        logger.error(`Error updating category ${req.body.uuid}`, err);
        res.sendStatus(500);
      }
    });

    router.delete("/shop/category", async (req, res) => {
      if (req.body.confirmation !== "DELETE") {
        res.status(400).send("Invalid confirmation.");
        return;
      }

      try {
        if (await shop.delCategory(db, req.body.uuid)) {
          res.sendStatus(200);
          await updateCategoryCache();
        } else res.sendStatus(400);
      } catch {
        res.sendStatus(500);
      }
    });

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    async function updateCategoryCache() {
      const main = (await shop.getCategoryByName(db, "MAIN"))[0];

      const categories = await shop.getCategoryVisible(db);
      await asyncForEach(categories, async (category) => {
        const subcategories = await shop.getSubcategories(db, category.uuid);
        category.subcategories = subcategories;

        // Add subcategories data to subcategories
        await asyncForEach(subcategories, async (subcategory) => {
          const subcategoriesData = await shop.getSubcategories(
            db,
            subcategory.uuid
          );
          subcategory.subcategories = subcategoriesData;
        });
      });

      main.subcategories = categories;

      cacheCategory.save({
        lastUpdate: Date.now(),
        main,
        categories,
      });

      return {
        lastUpdate: Date.now(),
        main,
        categories,
      };
    }

    //#endregion

    /****************************************/
    /***              Updates             ***/
    /****************************************/

    //#region Updates

    router.get("/updates", async (_req, res) => {
      const pool = await db();
      const query = await pool.query( `SELECT * FROM ${webTable}.update_posts ORDER BY date DESC`);
      pool.end();
      
      res.status(200).send(query);
    });

    router.post("/updates", async (req, res) => {
      const { title, content } = req.body;
      if (!title || !content) {
        res.status(400).send({ error: "Bad request" });
        return;
      }

      const pool = await db();
      const data = {
        uuid: uuidv4(),
        title,
        content,
        date: Date.now(),
      };
      const query = await pool.query( `INSERT INTO ${webTable}.update_posts SET ?`, [ data ]);
      pool.end();

      if (query) res.status(200).send(data);
      else res.status(500).send({ error: "Internal server error" });
    });

    router.put("/updates", async (req, res) => {
      const { uuid, title, content, date } = req.body;
      if (!uuid || !title || !content || !date) {
        res.status(400).send({ error: "Bad request" });
        return;
      }

      const pool = await db();
      const data = {
        uuid,
        title,
        content,
        date
      };
      const query = await pool.query(
        `UPDATE ${webTable}.update_posts SET ? WHERE uuid = ?`,
        [ data, uuid ]
      );
      pool.end();

      if (query) res.status(200).send(data);
      else res.status(500).send({ error: "Internal server error" });
    });

    //#endregion
  }
);
