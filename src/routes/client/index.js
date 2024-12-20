const exec_cmd = "give [&&] tellraw";
const exec_params = `{{ PlayerName }} stone 1 [&&] {{ PlayerName }} ["",{"text":">>","color":"dark_gray"},{"text":" {{ PlayerName }}","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"{{ ProductName }}","color":"light_purple"},{"text":".","color":"gray"}]`;
// tellraw @a ["",{"text":">>","color":"dark_gray"},{"text":" Quiralte234","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"Normal Key x5","color":"light_purple"},{"text":".","color":"gray"}]

const paypal = require("../../services/paypal");
const extra = require("../../lib/Routes/extra");
const shop = require("../../lib/shop");
const redis = require("../../services/redis");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const webTable = require("../../../config").DB.web;

/**
 * @param {redis.Redis} redis
 * @param {string[]} commands
 * @return {Promise<number>}
 */
async function executeCommands(redis, commands, env) {
  return await redis.send(`RECEIVED;false;${env["PlayerName"]};${commands.join("[SEP]")}`);
}

/**
 * @param {string} command
 * @param {string} args
 * @param {{ [key: string]: string }} env
 * @return {string}
 */
function normalizeCommand(command, args, env) {
  for (let _var in env) {
    args = args.replace(new RegExp(`\\{\\{\\s*${_var}\\s*\\}\\}`, "g"), env[_var]);
  }

  return `${command} ${args}`;
}

let lastRequest = null;
let lastRequestTime = 0;

module.exports = require("../../lib/Routes/exports")(
  "/",
  (router, waRedirect, db, redis) => {
    router.get("/test", (req, res) => {
      res.status(200).render("Tests");
    });

    router.use(extra(require("./redirect"), db, redis));
    router.use(extra(require("./soon"), db, redis));
    router.use(extra(require("./profile"), db, redis));
    router.use(extra(require("./shop"), db, redis));

    router.get("/", async (req, res) => {
      if (Date.now() - lastRequestTime >= 1000) {
        lastRequest = await fetch("https://api.mcsrvstat.us/2/nasgar.online", {
          headers: {
            "Cache-Control": "no-cache",
          },
        })
          .then((res) => res.json())
          .catch(() => null);

        lastRequestTime = Date.now();
      }

      res.render("pags/index", { serverData: lastRequest });
    });

    router.get("/news", async (req, res) => {
      res.render("pags/updates");
    });

    router.get("/news/:uuid", async (req, res) => {
      const uuid = req.params.uuid;
      res.render("pags/news/$uuid", { uuid });
    })

    router.get("/pay/return", async (req, res) => {
      const qk = Array.from(Object.keys(req.query));

      if (
        !(
          qk.indexOf("paymentId") != -1 &&
          qk.indexOf("token") != -1 &&
          qk.indexOf("PayerID") != -1
        )
      ) {
        res.status(400).redirect("/");
        return;
      }

      // Verify the payment
      const { paymentId } = req.query;
      const verified = await paypal.verifyPayment(paymentId);
      console.log(verified);


      // Normalize the cart
      const products_cart = req.session.shopCart
        .split(";")[0]
        .split(",")
        .map((_) => {
          const p = _.split(":");
          return {
            uuid: p[0],
            quantity: parseInt(p[1]),
            gift: p[2] === "false" || p[2] === undefined ? false : p[2],
          };
        });
      const products = products_cart.map(
        async (product) => await shop.getProduct(db, product.uuid)
      );


      // Normalize the commands
      const commands = [];
      for (let _product of products) {
        const product = await _product;

        const cmds = product.exec_cmd.split(" [&&] ");
        const args = product.exec_params.split(" [&&] ");

        for (let i = 0; i < cmds.length; i++) {
          commands.push(
            normalizeCommand(cmds[i], args[i], {
              PlayerName: req.session.nick,
              ProductName: product.name,
            })
          );
        }
      }

      console.log(commands);

      // Execute the commands
      await executeCommands(redis, commands, {
        PlayerName: req.session.nick,
      });

      res.status(200).render("prefabs/splash", {
        seconds: 5,
        title: "Compra finalizada - Nasgar Network",
        texts: {
          text: "Gracias por comprar.",
          help: "Si tienes problemas con la compra contactanos por <a href='https://ds.nasgar.online' >Discord</a>.",
        },
        link: {
          text: "la pantalla principal",
          href: "/",
        },
        extra:
          "<script>;(()=>{localStorage['shop_cupon'] = '';localStorage['shop_cart'] = '';})();</script>",
      });
    });

    router.get("/pay/cancel", (req, res) => {
      res.status(200).render("prefabs/splash", {
        seconds: 5,
        title: "Compra cancelada - Nasgar Network",
        texts: {
          text: "Compra cancelada.",
          help: "Si tienes problemas con la compra contactanos por <a href='https://ds.nasgar.online' >Discord</a>.",
        },
        link: {
          text: "la tienda",
          href: "/shop",
        },
      });
    });

    router.get("/ResetSession", (req, res) => {
      req.session.destroy((err) => {
        if (err) return res.render("errors/500");
        res.redirect("/");
      });
    });
  }
);
