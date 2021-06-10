/**
 * @typedef {{
 * 		dom: HTMLDivElement
 * }} ToastOptions
 */

class Toast {
	/**
	 * 
	 * @param {ToastOptions} options 
	 */
	constructor(options) {
		if(options == null) {
			this._create();
		}
	}

	_create() {
		const dom = document.createElement("div");

		return dom;
	}
}

export default Toast;