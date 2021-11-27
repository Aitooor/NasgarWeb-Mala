const shop = require("../../lib/shop");
const cacheCategory = require("../../lib/cacheCategory");
const { getCategoryVisible, getSubcategories } = shop;

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function autoUpdate(db) {
  if (Date.now() - cacheCategory.read()?.lastUpdate > 1000) {
    await updateCache(db);
  }
}

async function updateCache(db) {
  const main = (await shop.getCategoryByName(db, "MAIN"))[0];
  await asyncForEach(main.subcategories, async (category, i) => {
    const subcategory = await shop.getCategory(db, category);
    main.subcategories[i] = subcategory;
  });


  // TODO: Resolve a bug with subcategories
  const categories = await getCategoryVisible(db);
  await asyncForEach(categories, async (category) => {
    const subcategories = await getSubcategories(db, category.uuid);
    category.subcategories = subcategories;

    // Add subcategories data to subcategories
    await asyncForEach(subcategories, async (subcategory) => {
      const subcategoriesData = await shop.getSubcategories(db, subcategory.uuid);
      subcategory.subcategories = subcategoriesData;
    });
  });

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

async function getMain(db) {
  autoUpdate(db);

  if (cacheCategory.read()?.main) {
    return cacheCategory.read()?.main;
  }

  return (await updateCache(db)).main;
}

async function getCategories(db) {
  autoUpdate(db);

  if (
    cacheCategory.read()?.categories &&
    cacheCategory.read()?.categories.length > 0
  ) {
    return cacheCategory.read()?.categories;
  }

  return (await updateCache(db)).categories;
}

module.exports = require("../../lib/Routes/exports")(
  "/shop",
  (router, waRedirect, db, rcons) => {
    router.get("/", async (req, res) => {
      const categories = await getCategories(db);
      const category = await getMain(db);

      res.render("pags/shop/index", {
        category: category,
        products: [],
        categories,
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

      const categories = await getCategories(db);

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
