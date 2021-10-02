
/** 
 * @type {{Nada:0, Debil:1, SemiMedia:2, Media:3, Fuerte:4, 0:"Nada",1:"Debil",2:"SemiMedia",3:"Media",4:"Fuerte"}}
 */
// @ts-ignore
const PasswordLevel = ((_)=>{
	_[_["Nada"]      = 0] = "Nada";
	_[_["Debil"]     = 1] = "Debil";
	_[_["SemiMedia"] = 2] = "Debil";
	_[_["Media"]     = 3] = "Media";
	_[_["Fuerte"]    = 4] = "Fuerte";
	return _;
})({});

/**
 * @param {string} str
*/
function levelPassword(str) {
	if(str.length === 0)
		return PasswordLevel.Nada;

	if(str.length <= 5)
		return PasswordLevel.Debil;

	if(str.length >= 15) 
		return PasswordLevel.Fuerte;

	if(str.toUpperCase() === str ||
		 str.toLowerCase() === str)
		return PasswordLevel.Debil;	
	
	if(str.match(/^([a-z0-9])+$/i) !== null && 
	   str.length <= 8)
		return PasswordLevel.SemiMedia;	

	if(str.match(/[^a-z0-9]/gi) !== null && 
		 str.length >= 8)
		return PasswordLevel.Fuerte;

	return PasswordLevel.Media;
}

/** @type {HTMLDivElement} */
const passwordLine = document.querySelector("#passLine");

/** @type {HTMLInputElement} */
const passInput = document.querySelector("#password");

const passLevelColors = [
	"888", 
	"dc3545", "dc3545", 
	"3880be", 
	"28a745"
];

let fn;

passInput.addEventListener("input", (fn = () => {
	const level = levelPassword(passInput.value);
	const wL = 1 / (((level + 1) / 5) ** -1);

	const lineColor = passLevelColors[level];
	const lineWidth = Math.floor((level + wL) / 5 * 100);

	passwordLine.innerText = PasswordLevel[level];

	passwordLine
		.setAttribute(
			"style", 
			`--line-color: #${lineColor}; 
			 --line-width: ${lineWidth}%`
		);
}));

passInput.value = "";
fn();
