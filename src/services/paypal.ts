import paypal from "paypal-rest-sdk";
import CONFIG from "../../config";
import * as logger from "../lib/logger";

const PREFIX      = "&0;44 &1PAYPAL&0;44 &0&38;5;8 ";
const red_flag    = "&0;41   &0&38;5;8 ";
const green_flag  = "&0;42   &0&38;5;8 "


export const instance = paypal;

export function configure(sandbox: boolean = true) {
  paypal.configure({
    mode: "sandbox",
    client_id: CONFIG.PAYPAL.SANDBOX.ID,
    client_secret: CONFIG.PAYPAL.SANDBOX.SECRET
  });

  logger.log(PREFIX + "Paypal is configured.\x1b[0m");
  
};

export interface PaymentItem {
  uuid: string,
  name: string,
  quantity: number,
  price: number,
  gift: false | string
}

export interface PaymentOptions {
  redirect_urls: {
    return_url: string,
    cancel_url: string
  },

  items: PaymentItem[],

  discount?: {
    modify: number
  }
}

export function createPayment(options: PaymentOptions): Promise<paypal.PaymentResponse> {
  const has_cupon = typeof options.discount === "object";
  const cart: PaymentItem[] = options.items;
  const cart_total = cart.reduce((old, { quantity, price }) => quantity * price + old, 0);

  if(has_cupon) {
    cart.push({
      uuid: "discount",
      name: `Discount by cupon - ${Math.floor(options.discount.modify * 100)}%`,
      quantity: 1,
      price: cart_total * -options.discount.modify,
      gift: false
    })
  }

  const payment = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: options.redirect_urls,
    transactions: [{
      item_list: {
        items: cart.map(item => ({
          name: item.name + (item.gift ? ` <${item.gift}>` : ""),
          sku: item.uuid,
          quantity: item.quantity,
          currency: "USD",
          price: item.price.toFixed(2)
        }))
      },
      amount: {
        currency: "USD",
        total: (cart_total * (1 - options.discount.modify)).toFixed(2)
      },
      description: "Nasgar Network - " + 
        cart.reduce((a, {quantity, uuid}) => a + (uuid === "discount" ? 0 : quantity), 0) + 
        " item(s)" + 
        (!has_cupon ? "" : ` - with cupon`)
    }]
  };

  return new Promise<paypal.PaymentResponse>((res, rej) => {
    paypal.payment.create(payment, (err, _res) => {
      if(err) {
        logger.log(PREFIX + red_flag + "Payment failed.");
        rej(err);
        return;
      }

      logger.log(PREFIX + green_flag + "Payment success.");
      res(_res);
    });
  });
}

export interface ShopPaymentOptions {
  cart: PaymentItem[],
  cart_string: string,
  discount?: {
    modify: number
  }
}

export function createShopPayment(options: ShopPaymentOptions): Promise<paypal.PaymentResponse> {
  return createPayment({
    redirect_urls: {
      return_url: `${process.WEB_HREF}/pay/return?cart=${options.cart_string}`,
        cancel_url: `${process.WEB_HREF}/pay/cancel`
    },
    items: options.cart,
    discount: options.discount
  });
}
