// const { alertNotStaff, StaffMiddleware } = require("../../middlewares/staff");

// /**
//  * 
//  * @param {import("express").Express} app 
//  * @param {() => import("mysql").Pool} db 
//  * @param {import("rcon")[]} rcons
//  */
// module.exports = function(app, db, rcons) {

// 	app.get("/staff/send-message", StaffMiddleware, (req, res) => {
// 		res.render("pags/staff/send-message");
// 	});

// 	app.post("/staff/send-message", StaffMiddleware, async (req, res) => {
// 		const { user } = req.body;
		
// 		try {
// 			await rcons[0].send(`give ${user} stone`);
// 			await rcons[0].send(`tellraw ${user} ["",{"text":"\\u226b ","color":"gray"},{"text":"NASGAR","bold":true,"color":"aqua"},{"text":" \\u2502","bold":true,"color":"gray"},{"text":" COMPRAS","bold":true,"color":"green"},{"text":"\\n"},{"text":"\\u226b","color":"gray"},{"text":" Gracias por comprar","color":"gray"},{"text":" "},{"text":"x1 stone","italic":true,"color":"green","hoverEvent":{"action":"show_text","contents":{"text":"Stone","color":"green"}}},{"text":".","color":"gray"}]`);

// 			req.session.alert = "Sended";
// 		} catch(e) {
// 			req.session.alert = "Error";
// 			console.error(e);
// 		}

// 		req.session.showAlert = true;
// 		res.render("pags/staff/send-message");
// 	});

// 	require("./tests")(app, db);
// 	require("./basic-shorcuts")(app, db);
// }


module.exports = require("../../lib/Routes/imports")("/", [require("./account")]);