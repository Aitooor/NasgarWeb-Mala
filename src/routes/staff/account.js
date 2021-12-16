const CONFIG = require("../../../config");
const {
  middleware: userLevelMidd,
  Level,
} = require("../../middlewares/userLevel");

const adminMidd = userLevelMidd(Level.Admin, {
  moreThan: true,
  redirect: true,
  authPage: "/login",
});

module.exports = require("../../lib/Routes/exports")(
  "/staff",
  (router, waRedirect, db, rcons) => {
    router.get("/shop/products", adminMidd, (_req, res) => {
      res.render("pags/staff/shop/products");
    });

    router.get("/staff-timings", adminMidd, (_req, res) => {
      res.render("pags/staff/timings");
    });

    router.get("/shop", adminMidd, (_req, res) => {
      res.render("prefabs/cards_menu", {
        title: "Shop Menu",
        data: [
          {
            url: "/staff/shop/products",
            title: "Products",
            icon: "inventory_2/v9",
          },
          {
            url: "/staff/shop/categories",
            title: "Categories",
            icon: "reorder/v15",
          },
          {
            url: "/staff/assets",
            title: "Assets",
            icon: "collections/v12",
          },
        ],
        back: "url",
        back_url: "/staff",
      });
    });

    router.get("/shop/categories", adminMidd, (_req, res) => {
      res.render("pags/staff/shop/categories");
    });

    router.get("/", adminMidd, (_req, res) => {
      res.render("prefabs/cards_menu", {
        title: "Staff Menu",
        data: [
          {
            url: "/staff/staff-timings",
            title: "Timings",
            icon: "schedule/v16",
          },
          {
            url: "/staff/shop",
            title: "Shop",
            icon: "store/v11",
          },
          {
            url: "/staff/updates",
            title: "Updates",
            icon: "post_add/v11",
          },
        ],
        back: false,
      });
    });

    router.get("/updates", adminMidd, (_req, res) => {
      res.render("pags/staff/updates");
    });
  }
);
