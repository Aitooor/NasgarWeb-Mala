const mysql = require("mysql");
const Routes = require("../routes");
const { promisify } = require("util");

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
        host: process.env.SV_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
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

    createPool().end();

    return {
        createPool,
        reloadProducts: async () => {
            const pool = createPool();
            my_cache.products = await pool.query("SELECT * FROM web.products");
        },
        get products() {return my_cache.products}
    };
}