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

export function stringSort(down = false) {
	/**
	 * @param {string} a
	 * @param {string} b
	*/
	return (a, b) => {
		const maxLength = Math.max(a.length, b.length);
		
    for(let i=0; i < maxLength; i++) {
      if(a[i] == b[i]) continue;
      if(a[i] == undefined) return 1;
      if(b[i] == undefined) return -1;

      const _a = a.charCodeAt(i);
      const _b = b.charCodeAt(i);

			if(down) return _b - _a;
			return _a - _b;
    }

    return 0;
	}
}

/**
 * @param {Array} arr
 * @param {string} name
 * @param {number | string} filter
*/
export function applyFilter(arr, name, filter) {
	if(typeof filter === "number") {
		if(filter === 0) return;

		const down = filter < 0;

		const fn_str = stringSort(down);

		return arr.sort((_a, _b) => {
			const a = _a[name];
			const b = _b[name];
			
			const tpa = typeof a;
			const tpb = typeof b;

			if(tpa === "string" && 
				 tpb === "string")
				return fn_str(a, b);

			if((tpa === "boolean" &&
				  tpb === "boolean") ||
				 (tpa === "number" &&
				  tpb === "number"))
				return down ? b - a : a - b;
		});
	} else
	if(typeof filter === "string") {
		const reg = new RegExp(`^${filter}$`, "i");
		return arr.filter(_a => {
			const a = _a[name];

			if(typeof a !== "string") return false;

			return reg.test(a);
		});
	}
}

/**
 * @param {Array} arr
 * @param {{ [key: string]: number | string }} filters
*/
export function applyFilters(arr, filters) {
	if(arr.length === 0) return arr;



	return arr;
}
