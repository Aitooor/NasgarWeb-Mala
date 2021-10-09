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

        const images = res.images.length === 0 ? ["No image"] : res.images;

		for(let image of images) {
			const dom = document.createElement("div");
			dom.className = "image-cell";
			const img = new Image();
			img.dataset.flickityLazyloadSrc = image;

			dom.append(img);
			dom.append(document.createElement("span"));

			images_flickity.append(dom);
		}

		document.title = `${res.name} - Nasgar Network`;

    const addToCart = () => {
      const CART = "shop_cart";
      if(localStorage[CART] && 
         localStorage[CART] != "" ) 
      {
        const _cart = localStorage[CART];
        const old_cart = _cart.split(",").reduce((obj,_)=>{
          const pr = _.split(":");
          obj[pr[0]] = { 
            q: parseInt(pr[1]), 
            g: pr[2] == "false" || pr[2] == "undefined" || pr[2] == undefined ? false : pr[2]
          };
          return obj;
        }, {});
  
        if(old_cart[productUUID])
          old_cart[productUUID].q++;
        else
          old_cart[productUUID] = {
            q: 1,
            g: false
          };

        const new_cart = Object.keys(old_cart).map(_=>{
          return _+":"+old_cart[_].q+":"+old_cart[_].g;
        });

        localStorage[CART] = new_cart.join(",");
      } else {
        localStorage[CART] = `${productUUID}:1`;
      }
    }

		document.querySelector(".buy-btn").addEventListener("click", () => {
		  addToCart()
      window.open("/shop/cart", "_self");
		});

		document.querySelector(".cart-btn").addEventListener("click", () => {
		    addToCart();
				new Toast({
					title: "Añadido al carrito",
					body: `<b>${res.name}</b> fue añadido al carrito exitosamente.`,
					actions: [
						{ html: "Cerrar", action: "close" }
					]
        }).show();
		})
	})
	.catch((err) => {
		console.error(err);
		alert("Error loading product data! Contact us.");
	});

/**
 * 
 * @param {number} money
 * @return {string} Formated money
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
