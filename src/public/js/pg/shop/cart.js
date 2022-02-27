System.register(["../../components/toasts.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var toasts_js_1, toast, CART, cart, products_cache, cupon, products_ul, total_span, subtotal_span, btnPay, _main_cupon;
    var __moduleName = context_1 && context_1.id;
    function RELOAD() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                products_ul.innerHTML = "";
                if (typeof localStorage[CART] !== "string")
                    return reloadTotal();
                if (localStorage[CART].match(/^\s*$/) !== null) {
                    products_ul.innerHTML = "";
                    products_ul.classList.add("empty");
                    btnPay.classList.add("disabled");
                    return reloadTotal();
                }
                const products = localStorage[CART].split(",").map((_) => {
                    const p = _.split(":");
                    return {
                        uuid: p[0],
                        quantity: parseInt(p[1]),
                        gift: p[2] !== "false" && p[2] !== undefined ? p[2] : false,
                    };
                }) || [];
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];
                    let res;
                    if (product.uuid in products_cache) {
                        res = products_cache[product.uuid];
                    }
                    else {
                        const r = yield fetch("/api/get/product/" + product.uuid);
                        if (!r.ok) {
                            alert("Error fetching data for " +
                                product.uuid +
                                ". Response with code " +
                                r.status +
                                ".");
                            continue;
                        }
                        res = products_cache[product.uuid] = yield r.json();
                    }
                    const dom = updateProductDom(product, res, i);
                    cart.push(Object.assign(Object.assign({}, product), { name: res.name, price: res.price, dom,
                        product }));
                    reloadTotal();
                }
                _main_cupon();
            }
            catch (e) {
                alert(e);
            }
        });
    }
    function createProductDom({ product = null, i = 0, } = {}) {
        return GDom({
            elm: "li",
            attr: { class: `product product-${i}` },
            childs: [
                { attr: { class: "icon product-icon" } },
                {
                    attr: { class: "info" },
                    childs: [
                        { attr: { class: "name product-name" } },
                        {
                            attr: { class: "bottom" },
                            childs: [
                                {
                                    attr: { class: "quantity" },
                                    childs: [
                                        {
                                            elm: "button",
                                            attr: { class: "remove remove-quantity" },
                                            childs: ["-"],
                                        },
                                        {
                                            elm: "input",
                                            attr: {
                                                class: "quantity-input",
                                                type: "number",
                                                value: product.quantity.toString(),
                                                placeholder: "Quantity",
                                            },
                                        },
                                        {
                                            elm: "button",
                                            attr: { class: "add add-quantity" },
                                            childs: ["+"],
                                        },
                                    ],
                                },
                                { attr: { class: "total product-total" } },
                            ],
                        },
                        {
                            attr: { class: "remove remove-btn" },
                            childs: [
                                {
                                    elm: "i",
                                    attr: { class: "material" },
                                    childs: ["delete_outline"],
                                },
                            ],
                        },
                    ],
                },
                {
                    attr: { class: "actions", style: "display: none;" },
                    childs: [
                        {
                            attr: { class: `gift${product.gift ? " gifted" : ""}` },
                            childs: [
                                {
                                    elm: "i",
                                    attr: { class: "material" },
                                    childs: ["card_giftcard"],
                                },
                                {
                                    elm: "input",
                                    attr: {
                                        class: "gift-input",
                                        type: "text",
                                        value: product.gift || "",
                                        placeholder: "Username",
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    function updateProductDom(product, response, i) {
        var _a;
        const me = createProductDom({ product, i });
        products_ul.append(me);
        me.querySelector(".product-icon").append(img((_a = response === null || response === void 0 ? void 0 : response.images) === null || _a === void 0 ? void 0 : _a[0]));
        me.querySelector(".product-name").innerHTML = response.name;
        const total_span = me.querySelector(".product-total");
        total_span.innerText = monetize(product.quantity * response.price);
        me.querySelector(".remove-btn").onclick = () => {
            cart = cart.filter((_) => _.uuid !== product.uuid);
            reloadTotal();
            RELOAD();
        };
        const quantity_input = me.querySelector(".quantity-input");
        const quantity_add = me.querySelector(".add-quantity");
        const quantity_remove = me.querySelector(".remove-quantity");
        quantity_add.onclick = () => addQuantity(1);
        quantity_remove.onclick = () => removeQuantity(1);
        quantity_input.oninput = () => setQuantity(parseInt(quantity_input.value));
        quantity_input.onchange = () => setQuantity(limit(getQuantity(), 1, 999999));
        function getQuantity() {
            return parseInt(quantity_input.value) || 1;
        }
        function setQuantity(quantity) {
            quantity_input.value = isNaN(quantity) ? "" : quantity;
            cart[i].quantity = quantity || 0;
            reloadTotal();
            total_span.innerText = monetize(cart[i].quantity * response.price);
        }
        function addQuantity(n = 1) {
            setQuantity(limit(getQuantity() + n, 1, 999999));
        }
        function removeQuantity(n = 1) {
            setQuantity(limit(getQuantity() - n, 1, 999999));
        }
        const gift_div = me.querySelector(".actions > .gift");
        const gift_inp = gift_div.querySelector(".gift-input");
        const gift_btn = gift_div.querySelector("i.material");
        let gift_open = product.gift ? true : false;
        const _product = () => cart[i];
        gift_btn.onclick = () => {
            gift_open = !gift_open;
            gift_div.classList.toggle("gifted");
            if (!gift_open)
                _product().gift = false;
            reloadTotal();
        };
        gift_inp.onkeydown = (e) => {
            if (e.which === 13 || e.which === 10)
                gift_inp_handler();
        };
        gift_inp.onchange = gift_inp_handler;
        function gift_inp_handler() {
            if (gift_inp.value.length === 0) {
                alert(`Write the player's name or close the gift. [Gift of ${_product().name}]`);
                _product().gift = false;
                gift_inp.focus();
                reloadTotal();
                return;
            }
            gift_inp.blur();
            gift_inp.value = gift_inp.value.replace(/[:;]/g, "_");
            _product().gift = gift_inp.value;
            reloadTotal();
        }
        return me;
    }
    function limit(value, min, max) {
        return value > max ? max : value < min ? min : value;
    }
    function reloadTotal() {
        total_span.innerText = monetize(getTotal());
        if (cupon) {
            subtotal_span.classList.add("show");
            subtotal_span.innerText = monetize(getSubTotal());
        }
        else
            subtotal_span.classList.remove("show");
        localStorage[CART] = cart
            .map((_) => _.uuid + ":" + _.quantity + ":" + _.gift)
            .join(",");
    }
    function getSubTotal() {
        return cart.reduce((p, v) => {
            return v.quantity * v.price + p;
        }, 0);
    }
    function getTotal() {
        return getSubTotal() * (cupon != false ? 1 - cupon.modify : 1);
    }
    function img(src) {
        const img = new Image();
        img.src = src;
        return img;
    }
    function monetize(money) {
        if (typeof money !== "number")
            return "0.00";
        const moneyStr = money.toLocaleString("en");
        const sep = moneyStr.split(".");
        const cents = sep.length === 1 ? "00" : sep[1].length === 1 ? sep[1] + "0" : sep[1];
        return sep[0] + "." + cents;
    }
    function GDom(structure) {
        if (typeof structure === "string")
            return structure;
        const _elm = (structure === null || structure === void 0 ? void 0 : structure.elm) || "div";
        const elm = document.createElement(_elm);
        const _attr = (structure === null || structure === void 0 ? void 0 : structure.attr) || {};
        for (let attr in _attr)
            elm.setAttribute(attr, _attr[attr]);
        const _evt = (structure === null || structure === void 0 ? void 0 : structure.evt) || {};
        for (let evt in _evt)
            elm.addEventListener(evt, _evt[evt]);
        const _childs = (structure === null || structure === void 0 ? void 0 : structure.childs) || [];
        const childs = _childs.map(GDom);
        elm.append(...childs);
        return elm;
    }
    return {
        setters: [
            function (toasts_js_1_1) {
                toasts_js_1 = toasts_js_1_1;
            }
        ],
        execute: function () {
            toast = new toasts_js_1.default({
                title: "Nasgar copyright",
                body: window.global$copyright,
                data: {},
                actions: [
                    {
                        action: "close",
                        color: "success",
                        html: "Close",
                        actionArgs: ["@me"],
                    },
                ],
            }).show();
            CART = "shop_cart";
            cart = [];
            products_cache = {};
            cupon = false;
            products_ul = document.querySelector(".products");
            total_span = document.querySelector(".total-count");
            subtotal_span = document.querySelector(".subtotal-count");
            btnPay = document.querySelector(".btn-pay");
            btnPay.addEventListener("click", () => {
                window.open("/shop/pay?total=" + getTotal(), "_self");
            });
            _main_cupon = () => {
                try {
                    const _cupon = {
                        cupon: document.querySelector(".cupon-div"),
                        input: document.querySelector(".cupon-input"),
                        button: document.querySelector(".cupon-btn"),
                        txt: document.querySelector(".cupon-txt"),
                        clear: document.querySelector(".cupon-clear-btn"),
                    };
                    localStorage["shop_cupon"] = "";
                    reloadTotal();
                    const test_cupon = () => {
                        fetch("/api/get-cupon", {
                            method: "POST",
                            headers: { "Content-Type": "application/json;charset=UTF-8" },
                            body: JSON.stringify({
                                cupon: _cupon.input.value,
                            }),
                        })
                            .then((_res) => __awaiter(void 0, void 0, void 0, function* () {
                            if (_res.status === 400)
                                return alert("!");
                            let res = yield _res.json();
                            if (res.valid) {
                                _cupon.txt.innerText = res.cupon;
                                _cupon.cupon.classList.add("selected");
                                localStorage["shop_cupon"] = res.cupon;
                                cupon = res;
                                reloadTotal();
                                alert(`${res.cupon} is valid and it's have a ${res.modify * 100}% of discount`);
                            }
                            else {
                                localStorage["shop_cupon"] = "";
                                cupon = false;
                                reloadTotal();
                                alert(`${res.cupon} is not valid`);
                            }
                        }))
                            .catch(() => { });
                    };
                    _cupon.button.onclick = test_cupon;
                    _cupon.input.onkeydown = (e) => {
                        if (e.which === 13 || e.which === 10)
                            test_cupon();
                    };
                    _cupon.input.oninput = () => {
                        _cupon.input.value = _cupon.input.value.toUpperCase();
                    };
                    _cupon.clear.onclick = () => {
                        _cupon.cupon.classList.remove("selected");
                        cupon = false;
                        reloadTotal();
                    };
                }
                catch (e) {
                    alert(e);
                }
            };
            RELOAD();
        }
    };
});
//# sourceMappingURL=cart.js.map