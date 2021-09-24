/**
 * @param {number} money
 * @returns {string}
 */
export function monetize(money) {
	if(typeof money !== "number") return "0.00";
	const moneyStr = money.toLocaleString("en");
	const sep = moneyStr.split(".");
	const cents = sep.length === 1 ? 
					"00" :
					sep[1].length === 1 ? 
						sep[1] + "0" : 
						sep[1];
	return sep[0] + "." + cents;
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
	return new Promise(res => {
		setTimeout(res, ms);
	});
}

/**
 * @param {string} str
 * @returns {string}
*/
export function capitalize(str) {
	if(str.length === 0) return str;
	
	const _s = str.split("");
	_s[0] = _s[0].toUpperCase();
	return _s.join("");
}
