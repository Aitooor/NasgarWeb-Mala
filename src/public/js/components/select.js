///<reference path="../../../@types/less.d.ts" />

/** @type {CustomSelectElement[]} */
const allSelects = [];

window.addEventListener("click", (e) => {
	allSelects.map((v) => {
		if(e.target != v) v.opened = false;
	});
})

export class CustomSelectElement extends HTMLElement {
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

		allSelects.push(this);
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
			allSelects.map((v) => {
				if(v != this) v.opened = false;
			})
		} else {
			this.setAttribute("aria-active", "false");
			this.removeAttribute("active");
		}

		this.#isOpen = val;
		return val;
	}



	static get observedAttributes() {
		return ["active", "aria-active", "disabled", "aria-disabled"]
	}
}

/**
 * @class
 * @example
 * new Select(["Option1", "Option2", "Option3", "Option4", "Option5"], 2)
 */
export class Select {
	/**
	 * 
	 * @param  {string[]} options
	 * @param  {number} [selected] 
	 */
	constructor(options, selected = 0) {
		
	}
}

customElements.define("custom-select", CustomSelectElement);

export default Select;