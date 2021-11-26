module.exports = require("../../lib/Routes/exports")(
  "/",
  (router, waRedirect, db, rcons) => {
    router.get("/discord", (req, res) => {
      res.redirect("https://ds.nasgar.online");
    });

    router.get("/vote", (req, res) => {
      res.redirect("https://www.40servidoresmc.es/nasgar-network-votar");
    });
  }
);
