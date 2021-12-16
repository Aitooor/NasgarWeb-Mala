module.exports = require("../../lib/Routes/exports")(
  "/",
  (router, waRedirect, db, rcons) => {
    router.get("/bans", (_req, res) => {
      res.status(501).render("prefabs/soon", {
        tab: "Bans",
      });
    });
    router.get("/settings", (_req, res) => {
      res.status(501).render("prefabs/soon");
    });
    router.get("/profile", (_req, res) => {
      res.status(501).render("prefabs/soon");
    });
  }
);
