const exec_cmd = "give [&&] tellraw";
const exec_params = `{{ PlayerName }} stone 1 [&&] {{ PlayerName }} ["",{"text":">>","color":"dark_gray"},{"text":" {{ PlayerName }}","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"{{ ProductName }}","color":"light_purple"},{"text":".","color":"gray"}]`;

const extra = require("../../lib/Routes/extra");
// tellraw @a ["",{"text":">>","color":"dark_gray"},{"text":" Quiralte234","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"Normal Key x5","color":"light_purple"},{"text":".","color":"gray"}]
const shop = require("../../lib/shop");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * @param {import('rcon')} rcon
 * @param {string} command
 * @param {string} args
 * @param {{ [key: string]: string }} env
 * @return {Promise<string>}
 */
async function execute_command(rcon, command, args, env) {
  for (let _var in env) {
    args = args.replace(new RegExp(`\\{\\{${_var}\\}\\}`, "g"), env[_var]);
  }

  return await rcon.send(command + " " + args);
}

let lastRequest = null;
let lastRequestTime = 0;

module.exports = require("../../lib/Routes/exports")(
  "/",
  (router, waRedirect, db, rcons) => {
    router.get("/test", (req, res) => {
      res.status(200).render("Tests");
    });

    router.use(extra(require("./redirect"), db, rcons));
    router.use(extra(require("./soon"), db, rcons));
    router.use(extra(require("./profile"), db, rcons));
    router.use(extra(require("./shop"), db, rcons));

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

    router.get("/updates", async (req, res) => {
      res.render("pags/updates", {
        posts: [
          {
            title: "Update 1.0.0",
            date: "2020-04-01",
            content: `Est occaecat consequat reprehenderit duis elit in mollit. Do cupidatat sint ad nisi culpa ea culpa mollit id anim sit aliquip Lorem ea. Minim irure in quis culpa eu proident irure adipisicing. Ad qui nostrud reprehenderit aute magna amet ipsum exercitation. Pariatur velit et elit proident enim aliquip culpa dolore culpa dolore. Ipsum elit ea est ipsum nostrud sint laborum aliqua aliquip proident ipsum ut.

Aliquip minim enim labore eu dolore. Aute sint excepteur labore elit eu sint est nostrud adipisicing ipsum. Est minim reprehenderit sint consequat esse fugiat adipisicing aliquip anim commodo eiusmod dolor. Consequat consequat excepteur ex magna voluptate nisi ea tempor dolore incididunt ex incididunt aliqua. Magna commodo ea deserunt aliqua sunt magna consequat enim fugiat aute dolor labore aliqua mollit.

Occaecat aliquip sint ad cupidatat deserunt sunt. Sunt elit enim qui reprehenderit tempor qui exercitation. Mollit culpa sunt ipsum incididunt laboris velit tempor officia anim ea. Enim cupidatat in mollit ex voluptate sunt. Pariatur ad occaecat est aliquip ex. Aliqua occaecat sint adipisicing laborum.`,
          }
        ]
      });
    });

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

      const pool = db();

      for (let _product of products) {
        const product = await _product;

        const cmds = product.exec_cmd.split(" [&&] ");
        const args = product.exec_params.split(" [&&] ");

        for (let i = 0; i < cmds.length; i++) {
          await execute_command(rcons[0], cmds[i], args[i], {
            PlayerName: req.session.nick,
            ItemName: product.name,
          });
        }
      }

      res.status(200).render("prefabs/splash", {
        seconds: 10,
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
