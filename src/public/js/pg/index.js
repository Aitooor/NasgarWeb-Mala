import Toasts from  "../components/toasts.js";

globalThis.Toasts = Toasts;

document.querySelector(".banner-ip").onclick = async () => {
	const server_IP = "nasgar.online";
	let copied = false;
	
	if(!navigator.clipboard) {
		var textArea = document.createElement("textarea");
		textArea.value = server_IP;
		
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
			await navigator.clipboard.writeText(server_IP);
			console.log("Copied");
			copied = true;
		} catch (err) {
			console.log("Error copying: ", err);
		}
	}

	if(copied) {
		await Toasts.all(async (toast) => {
			if(toast.data.fired === "copy") return await toast.close();
			return;
		});
		
		new Toasts({ 
			title: "Copied to clipboard", 
			body: "Text copied: <i> nasgar.online </i>", 
			data: { 
				fired: "copy"
			}
		}).show();
	}
};

document.querySelector(".banner-discord").onclick = () => {window.open("https://discord.gg/PJk9uyhv6S", "_blank")};