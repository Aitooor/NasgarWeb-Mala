
fetch("/api/get/product/" + productUUID)
	.then(res => res.json())
	.then(res => {
		document.querySelector("main.product").classList.remove("loading");
		document.querySelector(".product-name").innerHTML = res.name;
		document.querySelector(".product-price").innerHTML = res.price;
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
	})
	.catch((err) => {
		console.error(err);
		alert("Error loading product data!");
	})