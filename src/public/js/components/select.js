///<reference path="../../../@types/less.d.ts" />

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

customElements.define("custom-select", class CustomSelectElement extends HTMLElement {
	#isOpen = false;
	/** @type {HTMLStyleElement} */
	static #style = null;

	/** @type {HTMLElement[]} */
	childrens = null;

	/** @type {HTMLOptionElement} */
	selectedOption = null;

	/** @type {ShadowRoot} */
	#shadow = null;

	/** @type {{trigger: HTMLDivElement, triggerSpan: HTMLSpanElement, triggerIcon: HTMLElement, options: HTMLDivElement}} */
	#structure = null;

	constructor() {
		super();

		// Save the childs before of clear
		this.childrens = [...this.children];

		// Create a shadow root and clear the childrens
		this.#shadow = this.attachShadow({ mode: "closed" });

		// Create the structure
		const structure = {
			trigger: document.createElement("div"),
			triggerSpan: document.createElement("span"),
			triggerIcon: document.createElement("i"),

			options: document.createElement("div"),
			optionsSlot: document.createElement("slot")
		}

		structure.trigger.className = "trigger";
		structure.triggerIcon.className = "material";
		structure.triggerIcon.append("expand_more");
		structure.trigger.append(structure.triggerSpan);
		structure.trigger.append(structure.triggerIcon);

		structure.options.className = "options";
		structure.options.append(structure.optionsSlot);
		this.childrens.forEach((child, i) => {
			if(child.nodeName !== "OPTION") return;
			
			structure.options.append(child);
			child.onclick = () => { this.select(i); };
		});

		this.#structure = structure;
	}

	// HTML Life Cycle
	connectedCallback() {
		if(CustomSelectElement.#style === null) {
			fetch("/css/components/select.css")
				.then(response => {
					if(!response.ok) throw "";
					else return response.text();
				})
				.then(output => {
					CustomSelectElement.#style = document.createElement("style");
					CustomSelectElement.#style.innerHTML = output;
					this.#shadow.append(CustomSelectElement.#style);
				})
				.catch(err => {
					if(confirm("It can't load select.less, Do you want reload page?")) {
						location.reload();
					} else {
						if(!confirm("Are you sure?")) location.reload();
					}
				})
		}

		this.#shadow.append(this.#structure.trigger);
		this.#shadow.append(this.#structure.options);

		{
			const selectedOption = this.#structure.options.querySelector("[selected]");

			if(selectedOption !== null) this.#select(selectedOption);
			else this.select(0);
		}

		this.#structure.trigger.addEventListener("click", () => {
			this.toggle();
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(newValue == oldValue) return;
		if(name === "active" || name === "disabled") return;

		if(name === "aria-active") {
			this.opened = newValue === 'true';
		} else 
		if(name === "aria-disabled") {
			this.disabled = newValue === 'true';
		}
	}

	// Private select methods
	#select(child) {
		if(this.selectedOption) this.selectedOption.removeAttribute("selected");
		this.selectedOption = child;
		this.#structure.triggerSpan.innerText = this.selectedOption.innerText;
		this.selectedOption.setAttribute("selected", "");

		this.dispatchEvent(new CustomEvent("select", { detail: { value: this.selectedOption.value ?? this.selectedOption.innerText } }))
	}

	// Select methods
	/**
	 * @param {number} index 
	 */
	select(index) {
		const s = this.childrens[index];

		if(s) {
			this.#select(s);
		} else {
			console.error(new RangeError("Children index not exist"));
		}

		this.opened = false;
	}

	toggle() {
		this.opened = !this.opened;
	}

	get opened() {
		return this.#isOpen;
	}

	set opened(val) {
		if(typeof val !== "boolean") return;
		if(val) {
			this.setAttribute("aria-active", "true");
			this.setAttribute("active", "");
		} else {
			this.setAttribute("aria-active", "false");
			this.removeAttribute("active");
		}

		this.#isOpen = val;
	}



	static get observedAttributes() {
		return ["active", "aria-active", "disabled", "aria-disabled"]
	}
});


export default class Select {
	constructor() {
		
	}
}