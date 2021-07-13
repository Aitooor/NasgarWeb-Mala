
fetch("/api/get/product/" + productUUID)
	.then(res => res.json())
	.then(res => {
		document.querySelector("main.product").classList.remove("loading");
		document.querySelector(".product-name").innerHTML = res.name;
		document.querySelector(".product-price").innerHTML = res.price;
		document.querySelector(".product-description").innerHTML = res.description;
	})
	.catch((err) => {
		console.error(err);
		alert("Error loading product data!");
	})