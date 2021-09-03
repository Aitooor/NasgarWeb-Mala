const mysql = require("mysql");
const { promisify } = require("util");
const CONFIG = require("../../config");

/** @typedef {{uuid: string, name: string, price: number, description: string, exec_cmd: string, exec_params: string}} product */
/** @type {{products: product[]}} */
let my_cache = {
    products: []
};

/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = async function(app) {
    const config = {
        host: CONFIG.SV_HOST,
        user: CONFIG.DB.USER,
        password: CONFIG.DB.PASS
    };

    let isFT = true;

    function createPool() {
        const pool = mysql.createPool(config);

        pool.getConnection((err, conn) => {
            if (err) {
                if (err.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error("DATABASE ERROR: Connection was closed");
                } else
                if (err.code === "ER_CON_COUNT_ERROR") {
                    console.error("DATABASE ERROR: Has many connections");
                } else
                if (err.code === "ECONNREFUSED") {
                    console.error("DATABASE ERROR: Connection was refused");
                }
            }

            if (conn) conn.release();
            if (isFT && !(isFT = false)) console.log("DB is connected");
        });

        pool.query = promisify(pool.query);
        pool.end = promisify(pool.end);

        return pool;
    };

    await createPool().end();

    return {
        createPool,
        reloadProducts: async () => {
            const pool = createPool();
            my_cache.products = await pool.query("SELECT * FROM web.products");
        },
        get products() {return my_cache.products}
    };
}
