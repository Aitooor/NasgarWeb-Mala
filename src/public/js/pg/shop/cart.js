const cart = [];
const products_cache = {};

/** @type {HTMLSpanElement} */
const total_span = document.querySelector(".total-count");

(async () => {
	for (let i = 0; i < products.length; i++) {
		const product = products[i];
		let res;
		if(product.uuid in products_cache) {
			res = products_cache[product.uuid];
		} else {
			const r = await (await fetch("/api/get/product/" + product.uuid)).json();
			res = products_cache[product.uuid] = r;
		}

		const dom = updateProductDom(product, res, i);

		cart.push({
			...product,
			price: res.price,
			dom
		});

		reloadTotal();
	}
})();

function updateProductDom(product, response, i) {
	/** @type {HTMLDivElement} */
	const me = document.querySelector(`.product-${i}.product-${product.uuid}`);
	me.querySelector(".product-icon").append(img(response.images[0]));
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
	return {};
}

function limit(value, min, max) {
	return value > max ? max : value < min ? min : value;
}

function reloadTotal() {
	total_span.innerText = monetize(getTotal());
}

/**
 * 
 * @returns {number}
 */
function getTotal() {
	return cart.reduce((p, v) => {
		return v.quantity * v.price + p;
	}, 0)
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