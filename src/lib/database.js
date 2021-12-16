const mysql = require("mysql");
const { promisify } = require("util");
const CONFIG = require("../../config");
const logger = require("./logger");

const PREFIX = "&43&1;30 DB &0&38;5;8";

/** @typedef {{uuid: string, name: string, price: number, description: string, exec_cmd: string, exec_params: string}} product */
/** @type {{products: product[]}} */
let my_cache = {
  products: [],
};

/**
 *
 * @param {import("express").Express} app
 */
module.exports = async function (app) {
  const config = {
    host: CONFIG.SV_HOST,
    user: CONFIG.DB.USER,
    password: CONFIG.DB.PASS,
    insecureAuth: true,
  };

  let isFT = true;

  const global_db = (() => {
    const pool = mysql.createPool(config);

    pool.getConnection((err, conn) => {
      if (err) {
        switch (err.code) {
          case "PROTOCOL_CONNECTION_LOST":
            logger.error(PREFIX, "&31Connection was closed");
            break;

          case "ER_CON_COUNT_ERROR":
            logger.error(PREFIX, "&31Has many connections");
            break;

          case "ECONNREFUSED":
            logger.error(PREFIX, "&31Connection was refused");
            break;
        
          default:
            logger.error(PREFIX, "&31Unknown error: ", err.code);
            break;
        }
      }

      if (conn) conn.release();
      if (isFT && !(isFT = false)) logger.log(PREFIX, "is connected");
    });

    pool.query = promisify(pool.query);
    // pool.end = promisify(pool.end);
    pool.end = async () => {};

    return pool;
  })();

  function createPool() {
    return global_db;
  }

  await createPool().end();

  return {
    createPool,
    reloadProducts: async () => {
      const pool = createPool();
      my_cache.products = await pool.query("SELECT * FROM web.products");
    },
    get products() {
      return my_cache.products;
    },
  };
};
