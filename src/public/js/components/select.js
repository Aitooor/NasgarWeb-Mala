document.querySelectorAll(".select").forEach(elm => {
	/** @type {HTMLDivElement} */
	const select = elm;
	/** @type {HTMLDivElement} */
	const trigger = elm.querySelector(".trigger");
	const visibleName = trigger.querySelector("span");
	/** @type {HTMLDivElement} */
	const optionsE = elm.querySelector(".options");
	/** @type {HTMLOptionElement[]} */
	const options = optionsE.querySelectorAll("option");
	/** @type {HTMLOptionElement} */
	let selected = optionsE.querySelector("[selected]") || options[0];

	const isOpened = () => select.classList.contains("active");

	selected.setAttribute("selected", "true");
	visibleName.innerText = selected.innerText;
	trigger.onclick = () => {
		select.classList.toggle("active");
	};

	options.forEach(option => {
		option.onclick = () => {
			select.classList.remove("active");
			if(option === selected) return;

			selected.removeAttribute("selected");
			option.setAttribute("selected", "true");
			selected = option;
			visibleName.innerText = selected.innerText;
		}
	});

	window.addEventListener("click", e => {
		const target = searchUpSelect(e.target, 10);
		if(target !== select) {
			if(!isOpened()) return;
			select.classList.remove("active");
		}
	})
});

/**
 * 
 * @param {HTMLElement} elm
 * @param {number} [max] 
 * @returns {HTMLElement}
 */
function searchUpSelect(elm, max = 20) {
	if(!elm) return null;
	if(elm?.classList?.contains?.("select")) return elm;
	if(max > 0) return searchUpSelect(elm?.parentNode, max - 1);
	return null;
}


export default class Select {
	constructor() {
		
	}
}