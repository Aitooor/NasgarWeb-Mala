/** @type {HTMLDivElement} */
const app_container = document.querySelector(".app-container");
/** @type {HTMLElement} */
const aside = document.querySelector(".app-container > aside");
/** @type {HTMLElement} */
const main = document.querySelector(".app-container > main");
/** @type {HTMLElement} */
const nav = document.querySelector(".app-container > main > nav");
/** @type {HTMLDivElement} */
const navTitle = document.querySelector(".app-container > main > nav > .title");

const LARGE = 2;
const MEDIUM = 1;
const SMALL = 0;

/** @type {LARGE | MEDIUM | SMALL} */
let size = LARGE;
let asideActive = false;

document.querySelector(".app-container > main > nav > .icon > i").onclick = () => {
	const wasActive = aside.classList.contains("active");
	asideActive = !wasActive;

	if(wasActive) {
		aside.classList.remove("active");
		aside.style.width = "0";
		function an() {
			aside.style.display = "none";
			app_container.style.gridTemplateColumns = "1fr";

			aside.removeEventListener("transitionend", an);
		}
		aside.addEventListener("transitionend", an);
		main.style.marginLeft = "0px";
		nav.style.left = "0px";
		navTitle.style.opacity = "1";
	} else {
		aside.classList.add("active");
		app_container.style.gridTemplateColumns = "auto 1fr";
		aside.style.display = "flex";
		
		if(size >= MEDIUM) {
			main.style.marginLeft = "250px";
		}
		if(size <= SMALL) {
			navTitle.style.opacity = "0";
			nav.style.left = "90%";
			aside.style.width = "90%";
		} else {
			nav.style.left = "250px";
			aside.style.width = "250px";
		}
	}
};


window.addEventListener("resize", () => {
	size = (
		window.innerWidth < 800 ? 
			window.innerWidth < 500 ?
				SMALL :
				MEDIUM :
			LARGE
	);

	if(asideActive) {
		if(size <= MEDIUM) {
			main.style.marginLeft = "0px";
		} else {
			main.style.marginLeft = "250px";
		}

		if(size <= SMALL) {
			navTitle.style.opacity = "0";
			nav.style.left = "90%";
			aside.style.width = "90%";
		} else {
			nav.style.left = "250px";
			aside.style.width = "250px";
		}
	}
});

size = (
	window.innerWidth < 800 ? 
		window.innerWidth < 500 ?
			SMALL :
			MEDIUM :
		LARGE
);

if(asideActive) {
	if(size <= MEDIUM) {
		main.style.marginLeft = "0px";
	} else {
		main.style.marginLeft = "250px";
	}

	if(size <= SMALL) {
		navTitle.style.opacity = "0";
		nav.style.left = "90%";
		aside.style.width = "90%";
	} else {
		nav.style.left = "250px";
		aside.style.width = "250px";
	}
}