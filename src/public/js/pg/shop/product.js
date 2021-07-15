import Toast from "../../components/toasts.js";
fetch("/api/get/product/" + productUUID)
	.then(res => res.json())
	.then(res => {
		document.querySelector("main.product").classList.remove("loading");
		document.querySelector(".product-name").innerHTML = res.name;
		document.querySelector(".product-price").innerHTML = monetize(res.price);
		document.querySelector(".product-description").innerHTML = res.description;
		const images_dom = document.querySelector(".product-images");
		const images_flickity = new Flickity(images_dom, { 
			"lazyLoad": 1, 
			"fullscreen": true, 
			"cellAlign": "center" 
		});

		for(let image of res.images) {
			const dom = document.createElement("div");
			dom.className = "image-cell";
			const img = new Image();
			img.dataset.flickityLazyloadSrc = image;

			dom.append(img);
			dom.append(document.createElement("span"));

			images_flickity.append(dom);
		}

		document.title = `${res.name} - Nargar Network`;

		document.querySelector(".buy-btn").addEventListener("click", () => {
			fetch("/shop/cart/add/" + productUUID, { method: "post" })
				.then(() => {
					window.open("/shop/cart", "_self");
				})
		});

		document.querySelector(".cart-btn").addEventListener("click", () => {
			fetch("/shop/cart/add/" + productUUID, { method: "post" })
				.then(() => {
					new Toast({
						title: "Añadido al carrito",
						body: `<b>${res.name}</b> fue añadido al carrito exitosamente.`,
						actions: [
							{ html: "Cerrar", action: "close" }
						]
					}).show();
				})
		})
	})
	.catch((err) => {
		console.error(err);
		alert("Error loading product data!");
	});

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