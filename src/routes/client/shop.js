const { getCategoryVisible } = require("../../lib/shop");

async function getCategories(db) {
  const categories = await getCategoryVisible(db);
  console.log(categories);
  return categories;
}

module.exports = require("../../lib/Routes/exports")(
  "/shop",
  (router, waRedirect, db, rcons) => {
    router.get("/", async (req, res) => {
      const categories = await getCategories(db);
      res.render("pags/shop/index", {
        category: { name: "MAIN", display: "{{NAME}}" },
        products: [],
        categories
      });
    });

    router.get("/product/:uuid", async (req, res) => {
      const uuid = req.params.uuid;
      const commands = exec_cmd.split(" [&&] ");
      const all_params = exec_params.split(" [&&] ");

      if (process.env.NODE_ENV !== "production" && false) {
        for (let i = 0; i < commands.length; i++) {
          const command = commands[i];
          let params = all_params[i];
          params = params.replace(/\{\{ PlayerName \}\}/g, "francaba");
          params = params.replace(/\{\{ ProductName \}\}/g, "Normal Key x5");

          await rcons[0].send(`${command} ${params}`);
        }
      }

      res.render("pags/shop/product", {
        product: uuid,
      });
    });

    router.get("/category/:uuid", async (req, res, next) => {
      const uuid = req.params.uuid;
      if (uuid.length !== 36) return next();

      const data = await shop.getCategory(db, uuid);
      if (data === null) return next();

      const products = await data.order.reduce(async (promise, uuid) => {
        return [
          ...(await promise),
          (await shop.getProduct(db, uuid)) ?? undefined,
        ].filter((v) => v);
      }, Promise.resolve([]));

      console.log(products);

      res.render("pags/shop/index", { category: data, products });
    });

    router.get("/cart", (req, res) => {
      res.render("pags/shop/cart");
    });

    router.get("/pay", (req, res) => {
      res.render("pags/shop/pay");
    });
  }
);
