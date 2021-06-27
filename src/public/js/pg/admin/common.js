/** @type {HTMLDivElement} */
const app_container = document.querySelector(".app-container");
/** @type {HTMLElement} */
const aside = document.querySelector(".app-container > aside");

document.querySelector(".app-container > main > nav > .icon > i").onclick = () => {
	const wasActive = aside.classList.contains("active");

	if(wasActive) {
		aside.classList.remove("active");
		aside.style.animationName = "aside-out";
		function an() {
			aside.style.display = "none";
			app_container.style.gridTemplateColumns = "1fr";

			aside.removeEventListener("animationend", an);
		}
		aside.addEventListener("animationend", an);
	} else {
		aside.classList.add("active");
		app_container.style.gridTemplateColumns = "auto 1fr";
		aside.style.display = "flex";
		aside.style.animationName = "aside-in";
	}
};