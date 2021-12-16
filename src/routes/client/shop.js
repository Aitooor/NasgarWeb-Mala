const shop = require("../../lib/shop");
const cacheCategory = require("../../lib/cacheCategory");

async function autoUpdate(db) {
  if (Date.now() - cacheCategory.read()?.lastUpdate > 1_000_000) {
    await updateCache(db);
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    array[index] = (await callback(array[index], index, array)) || array[index];
  }
  return array;
}

async function updateCache(db) {
  const main = (await shop.getCategoryByName(db, "MAIN"))[0];
  const categories = await shop.getAllCategories(db);

  for (let i = 0; i < categories.length; i++) {
    categories[i].subcategories = categories[i].subcategories.map((sub) =>
      categories.find((category) => category.uuid === sub)
    );
  }

  const visible = await asyncForEach(main.subcategories, async (category) => {
    return categories.find((c) => c.uuid === category);
  });

  cacheCategory.save({
    lastUpdate: Date.now(),
    main,
    categories,
    visible,
  });

  return {
    lastUpdate: Date.now(),
    main,
    categories,
    visible,
  };
}

async function getMain(db) {
  autoUpdate(db);

  let main = null;

  if (cacheCategory.read()?.main) {
    main = cacheCategory.read()?.main;
  }

  if (!main) main = (await updateCache(db)).main;

  return main;
}

async function getCategory(db, uuid) {
  autoUpdate(db);

  let category = null;

  if (
    cacheCategory.read()?.categories &&
    cacheCategory.read()?.categories.length > 0
  ) {
    const _category = cacheCategory
      .read()
      .categories.find((category) => category.uuid === uuid);
    if (_category) {
      category = _category;
    }
  }

  if (!category)
    category = (await updateCache(db)).categories.find(
      (category) => category.uuid === uuid
    );

  if (!category) return null;

  return category;
}

async function getVisibleCategories(db) {
  autoUpdate(db);

  let visible = null;

  if (
    cacheCategory.read()?.visible &&
    cacheCategory.read()?.visible.length > 0
  ) {
    visible = cacheCategory.read()?.visible;
  }

  if (!visible) visible = (await updateCache(db)).visible;

  return visible;
}

module.exports = require("../../lib/Routes/exports")(
  "/shop",
  (router, waRedirect, db, rcons) => {
    router.get("/", async (req, res) => {
      const category = await getMain(db);

      res.render("pags/shop/index", {
        category: category,
        products: [],
        categories: category.subcategories,
      });
    });

    router.get("/product/:uuid", async (req, res) => {
      const uuid = req.params.uuid;
      // const commands = exec_cmd.split(" [&&] ");
      // const all_params = exec_params.split(" [&&] ");

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

      const data = await getCategory(db, uuid);
      if (data === null || !data) return next();

      const categories = await getVisibleCategories(db);

      const products = await data.order.reduce(async (promise, uuid) => {
        return [
          ...(await promise),
          (await shop.getProduct(db, uuid)) ?? undefined,
        ].filter((v) => v);
      }, Promise.resolve([]));

      res.render("pags/shop/index", { category: data, products, categories });
    });

    router.get("/cart", (req, res) => {
      res.render("pags/shop/cart");
    });

    router.get("/pay", (req, res) => {
      res.render("pags/shop/pay");
    });
  }
);
