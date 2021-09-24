
const CART = "shop_cart";

/** @type {any[]} */
const cart = [];
const products_cache = {};

/** @type {boolean | object} */
let cupon = false;

const products_ul = document.querySelector(".products");

/** @type {HTMLSpanElement} */
const total_span = document.querySelector(".total-count");
/** @type {HTMLSpanElement} */
const subtotal_span = document.querySelector(".subtotal-count");

document
  .querySelector(".btn-pay")
  ?.addEventListener("click", () => {
    window.open("/shop/pay?total=" + getTotal(), "_self");
  });

/***********
 *  Cupon  *
 ***********/

const _main_cupon = () => {
  try {
  /** @type {{ 
      cupon: HTMLDivElement, 
      input: HTMLInputElement,
      button: HTMLButtonElement,
      txt: HTMLSpanElement,
      clear: HTMLButtonElement
    }} */
  const _cupon = {
    cupon:  document.querySelector(".cupon-div"),
    input:  document.querySelector(".cupon-input"),
    button: document.querySelector(".cupon-btn"),
    txt:    document.querySelector(".cupon-txt"),
    clear:  document.querySelector(".cupon-clear-btn")
  };

  localStorage["shop_cupon"] = "";
  reloadTotal();

  const test_cupon = () => {
    fetch("/api/get-cupon", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ 
        cupon: _cupon.input.value
      })
    })
      .then(async (_res) => {
        if(_res.status === 400) return alert("!");
        /** @type {Cupon} */
        let res = await _res.json();

        if(res.valid) {
          _cupon.txt.innerText = res.cupon;
          _cupon.cupon.classList.add("selected");

          localStorage["shop_cupon"] = res.cupon;
          cupon = res;
          reloadTotal();

          alert(`${res.cupon} is valid and it's have a ${res.modify * 100}% of discount`);
        } else {
          localStorage["shop_cupon"] = "";
          cupon = false;
          reloadTotal()

          alert(`${res.cupon} is not valid`);
        }
      })
      .catch(()=>{});
  };

  _cupon.button.onclick = test_cupon;

  _cupon.input.onkeydown = e => {
    if(e.which === 13 || e.which === 10)
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
  }catch(e){alert(e)}
};

/************************/

(async () => {try{
  if(typeof localStorage[CART] !== "string")
    return reloadTotal();
  if(localStorage[CART].match(/^\s*$/) !== null) 
    return reloadTotal();

  const products = localStorage[CART]
    .split(",")
    .map((_) => {
      const p = _.split(":");
      return {
        uuid: p[0],
        quantity: parseInt(p[1]),
        gift: p[2] !== "false" && p[2] !== undefined ? 
                p[2] : 
                false
      };
    }) || [];

	for (let i = 0; i < products.length; i++) {
		const product = products[i];
		let res;
		if(product.uuid in products_cache) {
			res = products_cache[product.uuid];
		} else {
			const r = await fetch("/api/get/product/" + product.uuid);
      if(!r.ok) {
        alert("Error fetching data for " + product.uuid + ". Response with code " + r.status + ".");
        continue;
      }

			res = products_cache[product.uuid] = await r.json();
		}

		const dom = updateProductDom(product, res, i);

		cart.push({
      ...product,
      name: res.name,
			price: res.price,
			dom,
      product
		});

		reloadTotal();
	}

  _main_cupon();
}catch(e){alert(e)}
})();

/** @typedef {{ valid: boolean, cupon: string, modify?: number}} Cupon */
/** @typedef {{ uuid: string, quantity: number, gift: boolean | string }} Product */
/** @typedef {{ uuid: string, name: string, price: number, images: string[]}} ProductResponse */

/**
 * @param {{ product?: Product | null, i?: number | undefined}} param
*/
function createProductDom({ product = null, i = 0 } = {}) {
  return GDom({
    elm: "li",
    attr: { "class": `product product-${i}` },
    childs: [
      { attr: { "class": "icon product-icon" } }, 
      { attr: { "class": "info" },
        childs: [
          { attr: { "class": "name product-name" } }, 
          { attr: { "class": "bottom" },
            childs: [
              { attr: { "class": "quantity" },
                childs: [
                  { elm: "button",
                    attr: { "class": "remove remove-quantity" },
                    childs: [ "-" ] },
                  { elm: "input",
                    attr: { 
                      "class": "quantity-input",
                      type: "number",
                      value: product.quantity,
                      placeholder: "Quantity"
                    } },
                  { elm: "button",
                    attr: { "class": "add add-quantity" },
                    childs: [ "+" ] }
                ] },
              { attr: { "class": "total product-total" } }
            ] }, 
          { attr: { "class": "remove" },
            childs: [{
              elm: "i",
              attr: { "class": "material" },
              childs: [ "delete_outline" ]
            }] }
        ] }, 
      { attr: { "class": "actions" },
        childs: [{ 
          attr: { "class": `gift${product.gift ? " gifted" : "" }` },
          childs: [
            { elm: "i",
              attr: { "class": "material" },
              childs: [ "card_giftcard" ] }, 
            { elm: "input",
              attr: { 
                "class": "gift-input",
                type: "text", 
                value: product.gift || "",
                placeholder: "Username"
              } }
          ]
        }]
      }
    ]
  });
};

/**
 * @param {Product} product
 * @param {ProductResponse} response
 * @param {number} i
 */
function updateProductDom(product, response, i) {
	/** @type {HTMLDivElement} */
	const me = createProductDom({ product, i });
  products_ul.append(me);
	me.querySelector(".product-icon").append(img(response?.images?.[0]));
	me.querySelector(".product-name").innerHTML = response.name;
	const total_span = me.querySelector(".product-total");

	total_span.innerHTML = monetize(product.quantity * response.price);

	/** @type {HTMLInputElement} */
	const quantity_input = me.querySelector(".quantity-input");
	/** @type {HTMLButtonElement} */
	const quantity_add = me.querySelector(".add-quantity"); 
	/** @type {HTMLButtonElement} */
	const quantity_remove = me.querySelector(".remove-quantity");

	quantity_add.onclick = () => addQuantity(1);
	quantity_remove.onclick = () => removeQuantity(1);

	quantity_input.oninput = () => setQuantity(parseInt(quantity_input.value));
	quantity_input.onchange = () => setQuantity(limit(getQuantity(), 1, 999_999));

	function getQuantity() {
		return parseInt(quantity_input.value) || 1;
	}
	function setQuantity(quantity) {
		quantity_input.value = isNaN(quantity) ? "" : quantity;
		cart[i].quantity = quantity || 0;
		reloadTotal();
		total_span.innerHTML = monetize(cart[i].quantity * response.price);
	}

	function addQuantity(n = 1) {setQuantity(limit(getQuantity() + n, 1, 999_999));}
	function removeQuantity(n = 1) {setQuantity(limit(getQuantity() - n, 1, 999_999));}

  const gift_div = me.querySelector(".actions > .gift");
  /** @type {HTMLInputElement} */
  const gift_inp = gift_div.querySelector(".gift-input");
  /** @type {HTMLButtonElement} */
  const gift_btn = gift_div.querySelector("i.material");
  let gift_open = product.gift ? true : false;

  const _product = () => cart[i];

  gift_btn.onclick = () => {
    gift_open = !gift_open;
    gift_div.classList.toggle("gifted");
    if(!gift_open)
      _product().gift = false;

    reloadTotal();
  };

  gift_inp.onkeydown = e => {
    if(e.which === 13 || e.which === 10)
      gift_inp_handler();
  };
  gift_inp.onchange = gift_inp_handler;

  function gift_inp_handler() {
    if(gift_inp.value.length === 0){
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
  if(cupon) {
    subtotal_span.classList.add("show");
    subtotal_span.innerText = monetize(getSubTotal());
  } else 
    subtotal_span.classList.remove("show");
  localStorage[CART] = cart.map(_ => _.uuid+":"+_.quantity+":"+_.gift).join(",");
}

/**
 * 
 * @returns {number}
 */
function getSubTotal() {
	return cart.reduce((p, v) => {
		return v.quantity * v.price + p;
	}, 0);
}

/**
 * @returns {number}
 */
function getTotal() {
  return getSubTotal() * (cupon != false ? 1 - cupon.modify : 1);
}

/**
 * 
 * @param {string} src 
 * @returns {HTMLImageElement}
 */
function img(src) {
	const img = new Image();
	img.src = src;
	return img;
}

/**
 * 
 * @param {number} money 
 */
function monetize(money) {
	if(typeof money !== "number") return "0.00";
	const moneyStr = money.toLocaleString("en");
	const sep = moneyStr.split(".");
	const cents = sep.length === 1 ? 
					"00" :
					sep[1].length === 1 ? 
						sep[1] + "0" : 
						sep[1];
	return sep[0] + "." + cents;
}

/**
 * @typedef {{ elm?: string, attr: { [attr: string]: string}, evt: { [evt: string]: (...args: any[]) => void }, childs: GDom_Node[] }} GDom_Node
 */
// Transform a json to HTMLElement with attributes and childs
/**
 * @param {GDom_Node | string} structure
 * @return {HTMLElement | string}
 */
function GDom(structure) {
  if(typeof structure === "string")
    return structure;

  const _elm = structure?.elm || "div";
  const elm = document.createElement(_elm);
  const _attr = structure?.attr || {};
  for(let attr in _attr)
    elm.setAttribute(attr, _attr[attr]);
  
  const _evt = structure?.evt || {};
  for(let evt in _evt)
    elm.addEventListener(evt, _evt[evt]);

  const _childs = structure?.childs || [];
  const childs = _childs.map(GDom);
  
  elm.append(...childs);

  return elm;
}
