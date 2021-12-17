/**
 * @typedef {AddActionOptions} ToastAction
 * 
 * @typedef {{
 * 		title: string;
 * 		body: string;
 * 		actions: ToastAction[];
 * 		data: {
 * 			[key: string]: any
 * 		};
 * }} ToastOptions
 * 
 * @typedef {(...args: any[]) => void} ActionFunction
 * 
 * @typedef {{
 * 		isOutline?: boolean;
 * 		color?: "primary" | "success" | "info" | "warning" | "danger";
 * 		action?: "none" | "close" | "link" | "custom" | ActionFunction;
 * 		actionArgs?: Array | string | null;
 * 		html?: string | HTMLElement[];
 * }} AddActionOptions
 * 
 * @typedef {{
 * 		main: HTMLDivElement;
 * 		parts: {
 * 			main: HTMLDivElement;
 * 			header: HTMLDivElement;
 * 			body: HTMLDivElement;
 * 			actions: HTMLDivElement;
 * 		};
 * 		f: {
 * 			setTitle(newTitle: string) => void;
 * 			setBody(newBody: string) => void;
 * 			addAction(options: AddActionOptions) => HTMLButtonElement;
 * 		}
 * }} ToastCreate
 */

/** @type {HTMLDivElement} */
const ToastMain = document.querySelector("div.toasts");
let TotalToasts = 0;
/** @type {Toast[]} */
const allToasts = [];
let maxToasts = 5;

class Toast {
	/**
	 * 
	 * @param {ToastOptions} options 
	 */
	constructor(options) {
		options = Object.assign({
			title: "Tittle",
			body: "Body",
			actions: null,
			data: {}
		}, options);

		const dom = this._create();
		dom.f.setTitle(options.title);
		dom.f.setBody(options.body);
		if(options?.actions) {
			for(const action of options.actions) {
				dom.f.addAction(action);
			}
		} else {
			dom.f.addAction({ color: "danger", html: "Close", action: "close", actionArgs: "@me"});
		}

		this.dom = dom;
		this.data = options.data;

		this._init();

		allToasts.push(this);

		if(allToasts.length >= maxToasts) {
			while(allToasts.length >= maxToasts) allToasts.shift().close();
		}
	}

	_init() {
		const actions = [...this.dom.parts.actions.querySelectorAll("button[class*=\"action-\"]")];

		for(const actionD of actions) {
			/** @type {string} */
			const action = actionD.dataset.action?.toLowerCase?.();
			/** @type {string[]} */
			const actionArgs = actionD.dataset.actionParams?.split?.(",");

			actionD.addEventListener("click", () => {
				if(action === "close") {
					if(actionArgs[0] === "@me") {
						this.close();
					}
				} else 
				if(action === "link") {
					window.open(...actionArgs);
				}
			})
		}
	}

	show() {
		ToastMain.append(this.dom.main);
	}

	close() {
		this.dom.main.style.animationDuration = ".2s";
		this.dom.main.style.animationName = "ToastOut";
		this.dom.main.addEventListener("animationend", () => {
			ToastMain.removeChild(this.dom.main);
		});
	}

	/**
	 * 
	 * @param {string} [id] 
	 * @returns {ToastCreate}
	 */
	_create(id = null) {
		const main = document.createElement("div");
		const header = document.createElement("div");
		const body = document.createElement("div");
		const actions = document.createElement("div");

		main.className = "toast";
		header.className = "toast-header";
		body.className = "toast-body";
		actions.className = "toast-actions";

		main.append(header);
		main.append(body);
		main.append(actions);

		main.dataset["toastId"] = id = id || "Toast-" + (++TotalToasts);

		return {
			main, 
			parts: {main, header, body, actions},
			f: {
				setTitle(newTitle) {header.innerHTML = newTitle;},
				setBody(newBody) {body.innerHTML = newBody;},
				/**
				 * 
				 * @param {AddActionOptions} param0 
				 * @returns {HTMLButtonElement} 
				 */
				addAction({ isOutline = false, color = "primary", action = null, actionArgs = [], html = "" } = {}) {
					const button = document.createElement("button");
					
					let g = "action-";
					if(isOutline) g += "out-";
					g += color;

					button.className = g;

					action = action.toLowerCase();
					button.dataset.action = action;
					if(action === "link") {button.title = "link: " + actionArgs;}
					
					if(typeof actionArgs === 'string') {
						button.dataset.actionParams = actionArgs.replace(/^\s+/, "").replace(/\s+$/, "");
					} else 
					if(actionArgs instanceof Array) {
						button.dataset.actionParams = actionArgs.join(",");
					} else {
						button.dataset.actionParams = "";
					}

					const btn_append = (_html) => {
						if(typeof _html === "string") {
							button.innerHTML = _html;
						} else 
						if(_html instanceof HTMLElement) {
							button.append(_html);
						} else 
						if(_html instanceof Array) {
							for(const _htmlElement of _html) btn_append(_htmlElement);
						}
					};

					btn_append(html);

					actions.append(button);

					return button;
				}
			}
		};
	}

	static async all(callback) {
		for(let _ of allToasts) await callback?.(_, [...allToasts]);
	}
}

window.addEventListener("resize", (ui) => {
	const w = window.innerWidth;

	if(w <= 600) {
		maxToasts = 3;
	} else {
		maxToasts = 5;
	}
})

export default Toast;
