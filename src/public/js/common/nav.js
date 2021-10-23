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


const tabs = [...document.querySelectorAll(".tabs div.tab")];

tabs.forEach(tab => {
	tab.addEventListener("click", () => {
		tab.classList.toggle("active");
	});
})

const menubtn = document.querySelector("button.menu");
const mobile = document.querySelector(".mobile");

if(menubtn && mobile) {
	menubtn.addEventListener("click", () => {
		mobile.classList.toggle("active");
	});
}

const nav = document.querySelector("nav");

if(nav) {
	document.addEventListener("scroll", () => {
		let top = window.pageYOffset || document.documentElement.scrollTop;
		if (top > 150) {
			nav.classList.add("scrolled");
		} else {
			nav.classList.remove("scrolled");
		}
	});
}