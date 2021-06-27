const allOptions = document.querySelectorAll("header .options");
allOptions.forEach(options => {
	const aBtns = options.querySelectorAll("a");

	aBtns.forEach((elm) => {
		elm.onmouseenter = () => {
			options.classList.add("already-there-is-hovered-a");
			elm.style.color = "#FFF";
		}

		elm.onmouseleave = () => {
			options.classList.remove("already-there-is-hovered-a");
			elm.style.color = "currentColor";
		}
	});
});

/** @type {HTMLDivElement} */
const menuDom = document.querySelector(".menu");
if(menuDom) {
	const i = document.querySelector(".menu-btn i");
	if(i)
		i.onclick = () => {
			menuDom.classList.toggle("show");
			if(menuDom.classList.contains("show")) 
				menuDom.parentElement.classList.add("menu-show");
			else 
				menuDom.parentElement.classList.remove("menu-show");
		};
}