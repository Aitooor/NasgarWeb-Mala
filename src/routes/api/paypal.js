
const paypal = require("../../services/paypal");
const shop = require("../../lib/shop");

module.exports = require("../../lib/Routes/exports")("/paypal", (router, waRedirect, db) => {
  router.post("/generate", async (req, res) => {
    const body = req.body;
    
    if(!body.nick || !body.shop_cart) 
      return res.status(400).send({ error: { message: "Bad request.", details: "Body don't has nick or shop_cart"} });

    const nick = body.nick;
    const _cupon = body.shop_cart.split(";")[1];
    const cupon = await shop.getCupon(db, _cupon);
    const cupon_valid = cupon.valid;
    const cupon_modify = cupon_valid ? cupon.modify : 0;

    req.session.shopCart = body.shop_cart;
    req.session.nick = nick;

    const items_cart = body.shop_cart
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

    const cart = [];
    for(const item of items_cart){
      const product = await shop.getProduct(db, item.uuid);
      
      cart.push({
        uuid: item.uuid,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        gift: item.gift
      });
    };

    try {
      const payment = await paypal.createShopPayment({
        cart: cart,
        cart_string: body.shopCart,
        discount: cupon_valid ? {
          modify: cupon_modify
        } : undefined
      });

      res.redirect(payment
        .links
        .find(_ => _.method === "REDIRECT") // Select REDIRECT link
        .href
      );
    } catch(err) {
      console.error(err);
      res.status(500).type("json").send(err);
    }
  });
});
