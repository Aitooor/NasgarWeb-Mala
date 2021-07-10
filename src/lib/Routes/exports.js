const { Router } = require("express");

/**
 * 
 * @param {import("express").Response<any, Record<string, any>, number>} res 
 * @param {string} render 
 * @param {string} end 
 * @param {object} options 
 * @returns {Function}
 */
function waitAndRedirect(res, render, end, options) {
    res.render(render, options, (err, html) => {
        res.write(html + "\n");
    });
    return function() {
        res.end("<script>window.location='"+end+"'</script>");
    }
}

/** @type {import("./exports")} */
module.exports = function(route, callback) {

    const router = Router();
    
    function toReturn(...args) {
        callback(router, waitAndRedirect, ...args);
    };

    toReturn.r = router;
    toReturn.thisRoute = route;

    return toReturn;
}