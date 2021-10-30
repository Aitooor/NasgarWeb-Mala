"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShopPayment = exports.createPayment = exports.configure = exports.instance = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const config_1 = __importDefault(require("../../config"));
const PREFIX = "\x1b[0;32m[\x1b[1mPAYPAL\x1b[0;32m] \x1b[0m\x1b[38;5;8m";
const red_flag = "\x1b[0;41m   \x1b[0m\x1b[38;5;8m ";
const green_flag = "\x1b[0;42m   \x1b[0m\x1b[38;5;8m ";
exports.instance = paypal_rest_sdk_1.default;
function configure(sandbox = true) {
    paypal_rest_sdk_1.default.configure({
        mode: "sandbox",
        client_id: config_1.default.PAYPAL.SANDBOX.ID,
        client_secret: config_1.default.PAYPAL.SANDBOX.SECRET
    });
    console.log(PREFIX + "Paypal is configured.\x1b[0m");
}
exports.configure = configure;
;
function createPayment(options) {
    const has_cupon = typeof options.discount === "object";
    const cart = options.items;
    const cart_total = cart.reduce((old, { quantity, price }) => quantity * price + old, 0);
    if (has_cupon) {
        cart.push({
            uuid: "discount",
            name: `Discount by cupon - ${Math.floor(options.discount.modify * 100)}%`,
            quantity: 1,
            price: cart_total * -options.discount.modify,
            gift: false
        });
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
                    cart.reduce((a, { quantity, uuid }) => a + (uuid === "discount" ? 0 : quantity), 0) +
                    " item(s)" +
                    (!has_cupon ? "" : ` - with cupon`)
            }]
    };
    return new Promise((res, rej) => {
        paypal_rest_sdk_1.default.payment.create(payment, (err, _res) => {
            if (err) {
                rej(err);
                console.log(PREFIX + red_flag + "Payment failed.");
                return;
            }
            res(_res);
            console.log(PREFIX + green_flag + "Payment success.");
        });
    });
}
exports.createPayment = createPayment;
function createShopPayment(options) {
    return createPayment({
        redirect_urls: {
            return_url: `${process.env.WEB_HREF}/pay/return?cart=${options.cart_string}`,
            cancel_url: `${process.env.WEB_HREF}/pay/cancel`
        },
        items: options.cart,
        discount: options.discount
    });
}
exports.createShopPayment = createShopPayment;
