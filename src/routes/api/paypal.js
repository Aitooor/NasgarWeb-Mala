
const paypal = require("paypal-rest-sdk");
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

    const cart_total = cart.reduce((old, { quantity, price }) => quantity * price + old, 0);
    
    if(cupon_valid) {
      cart.push({
        name: `Discount by cupon - ${Math.floor(cupon_modify * 100)}%`,
        uuid: "discount",
        quantity: 1,
        price: cart_total * -cupon_modify,
        gift: false
      });
    }

    const payment = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: `${process.env.WEB_HREF}/pay/return?cart=${body.shop_cart}`,
        cancel_url: `${process.env.WEB_HREF}/pay/cancel`
      },
      transactions: [{
        item_list: {
          items: cart.map(item => ({
            name: item.name + (item.gift ? ` <${item.gift}>` : ""),
            sku: item.uuid,
            quantity: item.quantity,
            currency: "USD",
            price: item.price
          }))
        },
        amount: {
          currency: "USD",
          total: cart_total * (1 - cupon_modify)
        },
        description: "Nasgar Network - " + 
          cart.reduce((a, {quantity, uuid}) => a + (uuid === "discount" ? 0 : quantity), 0) + 
          " item(s)" + 
          (cupon.length === 0 ? "" : ` - with cupon`)
      }]
    };

    paypal.payment.create(payment, (err, _res) => {
      if(err) {
        console.error(err);
        res.status(500).type("json").send(err);
        return;
      }

      res.redirect(_res
        .links
        .find(_ => _.method === "REDIRECT") // Select REDIRECT link
        .href
      );
    });
  });
});
