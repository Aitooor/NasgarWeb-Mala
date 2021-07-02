/**
 * Calculate the difference between `time` and now and
 * parse as how many time is ago
 * 
 * @example 
 * // Suppose today is 02/07/21 04:10:20 p.m.
 * const otherDay = new Date(); // 02/07/21 11:04:30 a.m. 
 * console.log(timeago(otherDay));
 * // Expected output:
 * //	  5 hours ago
 * @param {Date} time 
 * @returns {string}
 */
function timeago(time) {
	const now = new Date();
	let num = 0;

	num = now.getFullYear() - time.getFullYear();
	if(num > 0) {
		return `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`;
	}

	num = now.getMonth() - time.getMonth();
	if(num > 0) {
		return `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`;
	}
	
	num = now.getDate() - time.getDate();
	if(num > 0) {
		if(num < 7) return `${num} days ago`;
		return `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`;
	}
	
	num = now.getHours() - time.getHours();
	if(num > 0) {
		return `${num} hours ago`;
	}

	num = now.getMinutes() - time.getMinutes();
	if(num > 0) {
		return `${num} minutes ago`;
	}

	num = now.getSeconds() - time.getSeconds();
	if(num > 10) {
		return `${num} seconds ago`;
	}

	return "just now";
}

module.exports = {
	timeago
}