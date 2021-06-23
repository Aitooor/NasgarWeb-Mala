import Toasts from  "../components/toasts.js";
import "./nav.js";

globalThis.Toasts = Toasts;


async function copyText(txt, {silent = false} = {}) {
	let copied = false;
	
	if(!navigator.clipboard) {
		var textArea = document.createElement("textarea");
		textArea.value = txt;
		
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Fallback copied: ' + msg);
			copied = true;
		} catch (err) {
			console.error('Fallback error copying: ', err);
		}

		document.body.removeChild(textArea);
	} else {
		try {
			await navigator.clipboard.writeText(txt);
			console.log("Copied");
			copied = true;
		} catch (err) {
			console.log("Error copying: ", err);
		}
	}

	if(!silent && copied) {
		await Toasts.all(async (toast) => {
			if(toast.data.fired === "copy") return await toast.close();
			return;
		});
		
		new Toasts({ 
			title: "Copied to clipboard", 
			body: "Text copied: <i> " + txt +" </i>", 
			data: { 
				fired: "copy"
			}
		}).show();
	}
}

/**
 * @param {string} str 
 * @param {string} separator 
 * @param {number} [limit] 
 * @returns {string[]}
 */
function antiSpacesSplit(str, separator, limit) {
	return str.split(separator, limit).map(s => {
		return s.replace("^\s+", "").replace("\s+$");
	});
}

document
	.querySelectorAll("[data-commons-onclick]")
	.forEach(async (_elm) => {
		/** @type {HTMLElement} */
		const elm = _elm;

		elm.addEventListener("click", async () => {
			const dataAttr = elm.dataset.commonsOnclick;
			const dataParts = antiSpacesSplit(dataAttr, ",");
			if(dataParts[0] === "copy") {
				await copyText(dataParts[1]);
			} else 
			if(dataParts[0] === "link") {
				window.open(dataParts[1], dataParts[2] || "_self");
			}
		});
	});

globalThis.copyText = copyText;