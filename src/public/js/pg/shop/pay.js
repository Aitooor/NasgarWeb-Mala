/** @type {HTMLDivElement} */
const recaptcha = document.querySelector("div#recaptcha");
let captcha;

let mobile = false;
/**
 * @param {boolean} isMobile
 */
let onResize = (isMobile) => {};

const total_cash = document.querySelector(".total-cash");
const url_href = new URL(location.href);

if(!url_href.searchParams.get("total")) 
  window.open("/shop/cart", "_self");

total_cash.innerText = monetize(parseFloat(url_href.searchParams.get("total")));

function onLoadCaptcha() {
	captcha = grecaptcha.render(recaptcha, {
		'sitekey': "6LdyEpsbAAAAAOpq2VJOl8yQ_A0YRh8CSIfwcBCr"
	});

	/** @type {HTMLDivElement} */
	const c_0 = recaptcha.querySelector("div:first-child");
	/** @type {HTMLIFrameElement} */
	const c_1 = c_0.querySelector("iframe:first-of-type");

	onResize = (isMobile) => {
		if(isMobile) {
			c_0.style.width = "340px";
			c_0.style.height = "90px";
			c_1.width = "340";
			c_1.height = "90";
		} else {
			c_0.style.width = "304px";
			c_0.style.height = "78px";
			c_1.width = "304";
			c_1.height = "78";
		}
	}

	onResize(mobile);

	console.log(c_0, c_1);
}


function _onResize() {
	mobile = mobileCheck();
	onResize(mobile);
}


window.addEventListener("resize", _onResize);
_onResize();

/**
 * https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
 * @returns {boolean}
 */
function mobileCheck() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };

globalThis.onLoadCaptcha = onLoadCaptcha;




/* FORM VALIDATION */

const form = document.forms[0];
const formMsg = form.querySelector("div.msg");
let lastFormTimeout;

/**
 * 
 * @param {Event} e 
 */
globalThis.formValidator = (e) => {

	/** @type {HTMLInputElement} */
	const nick = form.querySelector("input[name=\"nick\"]");
	/** @type {HTMLInputElement} */
	const payment = form.querySelector("input[name=\"payment\"]:checked");

	if(nick.value.length <= 0) {
		nick.focus();
		formError("Introduze un Nick");
		return false;
	} else 
	if(grecaptcha.getResponse().length == 0) {
		formError("Completa el captcha");
		return false;
	} else {
    const inp = form.querySelector("input[name=\"shop_cart\"]");

    inp.value = localStorage["shop_cart"] + ";" + 
                localStorage["shop_cupon"];

		return true;
	}
}

function formError(msg) {
	if(lastFormTimeout) clearTimeout(lastFormTimeout);

	formMsg.classList.add("show");
	formMsg.innerHTML = msg;
	lastFormTimeout = setTimeout(() => {
		formMsg.classList.remove("show");
	}, 4000);
}

function monetize(money) {                                   if(typeof money !== "number") return "0.00";               const moneyStr = money.toLocaleString("en");               const sep = moneyStr.split(".");                           const cents = sep.length === 1 ?                                   "00" :                                                     sep[1].length === 1 ?                                        sep[1] + "0" :                                             sep[1];                                          return sep[0] + "." + cents;                             }
