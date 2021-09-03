const exec_cmd = "give [&&] tellraw";
const exec_params = `{{ PlayerName }} stone 1 [&&] {{ PlayerName }} ["",{"text":">>","color":"dark_gray"},{"text":" {{ PlayerName }}","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"{{ ProductName }}","color":"light_purple"},{"text":".","color":"gray"}]`;

// tellraw @a ["",{"text":">>","color":"dark_gray"},{"text":" Quiralte234","color":"green"},{"text":". Thanks you for buy ","color":"gray"},{"text":"Normal Key x5","color":"light_purple"},{"text":".","color":"gray"}]

module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
    router.get("/discord", (req, res) => {
        res.redirect("https://ds.nasgar.online");
    });
    
    router.get("/", async(req, res) => {

        res.render("pags/index");
    });

    router.get("/shop", (req, res) => {
        res.render("pags/shop/index", {
            products: [
                { uuid: "222ab-cdef4-36457", name: "Normal Key x5", price: "1.50", description: "5 Normal Keys for Normal Creates" }
            ]
        });
    });

	router.get("/shop/product/uuid/:uuid", async (req, res) => {
		const uuid = req.params.uuid;
		const commands = exec_cmd.split(" [&&] ");
		const all_params = exec_params.split(" [&&] ");

		if(process.env.NODE_ENV !== "production" && false) {
            for (let i = 0; i < commands.length; i++) {
                const command = commands[i];
                let params = all_params[i];
                params = params.replace(/\{\{ PlayerName \}\}/g, "francaba");
                params = params.replace(/\{\{ ProductName \}\}/g, "Normal Key x5");
                
                await rcons[0].send(`${command} ${params}`);
            }
        }

		res.render("pags/shop/product", {
            product: uuid,
            others: []
        });
	});

    router.get("/shop/cart", (req, res) => {
        res.render("pags/shop/cart", {
            products: [
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 2, gift: false},
                { uuid: "222ab-cdef4-36457", quantity: 3, gift: "iTito420"},
            ]
        });
    });

    router.post("/shop/cart/add/:uuid", (req, res) => {
        res.sendStatus(200);
    });

    router.get("/shop/pay", (req, res) => {
        res.render("pags/shop/pay")
    })

    router.get("/ResetSession", (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.render("errors/500");
            res.redirect("/");
        });
    });
})
