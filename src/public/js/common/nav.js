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