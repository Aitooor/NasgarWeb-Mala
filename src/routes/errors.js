module.exports = require("../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
    // * Error - 404
    router.use((req, res) => {
        res.locals = {
	    ...res.locals,
            error: {
                status: 404
            }
        };

        res.status(404);
        res.render("errors/404");
    });
});
