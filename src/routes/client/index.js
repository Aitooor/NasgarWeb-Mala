const exec_cmd = "give [&&] tellraw";
const exec_params = `{{ PlayerName }} stone 1 [&&] {{ PlayerName }} ["",{"text":">>","color":"dark_gray"},{"text":" {{ PlayerName }}","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"{{ ProductName }}","color":"light_purple"},{"text":".","color":"gray"}]`;

// tellraw @a ["",{"text":">>","color":"dark_gray"},{"text":" Quiralte234","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"Normal Key x5","color":"light_purple"},{"text":".","color":"gray"}]
const shop = require("../../lib/shop");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

/**
 * @param {import('rcon')} rcon
 * @param {string} command
 * @param {string} args
 * @param {{ [key: string]: string }} env
 * @return {Promise<string>}
 */
async function execute_command(rcon, command, args, env) {
  for(let _var in env) {
    args = args.replace(new RegExp(`\\{\\{${_var}\\}\\}`, "g"), env[_var]);
  }

  return await rcon.send(command + " " + args);
}

let lastRequest = null;
let lastRequestTime = 0;

module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
  
  router.get("/discord", (req, res) => {
    res.redirect("https://ds.nasgar.online");
  });

  router.get("/vote", (req, res) => {
    res.redirect("https://www.40servidoresmc.es/nasgar-network-votar");
  });

  router.get("/test", (req, res) => { res.status(200).render("Tests"); });

  router.get("/updates",  (_req, res) => { res.status(501).render("prefabs/soon") });
  router.get("/bans",     (_req, res) => { res.status(501).render("prefabs/soon") });
  router.get("/settings", (_req, res) => { res.status(501).render("prefabs/soon") });
  router.get("/profile",  (_req, res) => { res.status(501).render("prefabs/soon") });
    
  router.get("/", async (req, res) => {
    if(Date.now() - lastRequestTime >= 1000) {
      lastRequest = await fetch("https://api.mcsrvstat.us/2/nasgar.online", {
        headers: {
          "Cache-Control": "no-cache"
        }
      }).then(res => res.json()).catch(() => null);

      lastRequestTime = Date.now();
    };

    res.render("pags/index", { serverData: lastRequest });
  });

  router.get("/shop", async (req, res) => {
    res.render("pags/shop/index", {
      category: { name: "MAIN", display: "{{NAME}}" },
      products: []
    });
  });

  router.get("/pay/return", async (req, res) => {
    const qk = Array.from(Object.keys(req.query));

    if(!(
      qk.indexOf("paymentId") != -1 &&
      qk.indexOf("token")     != -1 &&
      qk.indexOf("PayerID")   != -1
    )) {
      res.status(400).redirect("/");
      return;
    }

    const products_cart = req.session.shopCart
      .split(";")[0]
      .split(",")
      .map(_ => {
        const p = _.split(":");
        return {
          uuid: p[0],
          quantity: parseInt(p[1]),
          gift: p[2] === "false" || p[2] === undefined ? false : p[2]
        }
      }); 
    const products = products_cart.map(async product => 
      await shop.getProduct(db, product.uuid)
    );

    const pool = db();

    for(let _product of products) {
      const product = await _product;

      const cmds = product.exec_cmd.split(" [&&] ");
      const args = product.exec_params.split(" [&&] ");

      for(let i = 0; i < cmds.length; i++) {
        await execute_command(rcons[0], cmds[i], args[i], {
          PlayerName: req.session.nick,
          ItemName: product.name
        });
      }
    }

    res.status(200).render("prefabs/splash", {
      seconds: 10,
      title: "Compra finalizada - Nasgar Network",
      texts: {
        text: "Gracias por comprar.",
        help: "Si tienes problemas con la compra contactanos por <a href='https://ds.nasgar.online' >Discord</a>."
      },
      link: {
        text: "la pantalla principal",
        href: "/"
      },
      extra: "<script>;(()=>{localStorage['shop_cupon'] = '';localStorage['shop_cart'] = '';})();</script>"
    });
  });

  router.get("/pay/cancel", (req, res) => {
    res.status(200).render("prefabs/splash", {
      seconds: 5,
      title: "Compra cancelada - Nasgar Network",
      texts: {
        text: "Compra cancelada.",
        help: "Si tienes problemas con la compra contactanos por <a href='https://ds.nasgar.online' >Discord</a>."
      },
      link: {
        text: "la tienda",
        href: "/shop"
      }
    });
  });

	router.get("/shop/product/uuid/:uuid", async (req, res) => {
		const uuid = req.params.uuid;
		const commands = exec_cmd.split(" [&&] ");
		const all_params = exec_params.split(" [&&] ");

		if(process.env.NODE_ENV !== "production" && false) {
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
      others: []
    });
	});


  router.get("/shop/category/:uuid", async (req, res, next) => {
    const uuid = req.params.uuid;
    if(uuid.length !== 36) return next();
    
    const data = await shop.getCategory(db, uuid);
    if(data === null) return next();

    const products = await data.order.reduce(async (promise, uuid) => {
      return [
        ...(await promise),
        await shop.getProduct(db, uuid) ?? undefined
      ].filter(v => v)
    }, Promise.resolve([]));

    console.log(products)

    res.render("pags/shop/index", { category: data, products })
  })

  router.get("/shop/cart", (req, res) => {
    res.render("pags/shop/cart");
  });

  router.get("/shop/pay", (req, res) => {
    res.render("pags/shop/pay")
  })

  router.get("/ResetSession", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.render("errors/500");
      res.redirect("/");
    });
  });
})
