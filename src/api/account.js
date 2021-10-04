const { encrypt } = require("../lib/pass");
const { Level } = require("../@types/userLevel");

const PREFIX = "\x1b[0;1;31m[ACCOUNTS] \x1b[0;37m";

/** @typedef {{ status: number, msg: string, [k: string]: any }} AccountError */

/**
 * @param {() => import("mysql").Pool} db
 * @param {string?} username
 * @param {string?} password
 *
 * @returns {Promise<{ done: boolean, data: object | null, error: AccountError | null }>}
*/
async function login(db, username, password) {
  if(typeof username != "string" || 
        username.match(/^\s*$/) !== null ||
     typeof password != "string" || 
        password.match(/^\s*$/) !== null ) {
    return {
      done: false,
      data: null,
      error: {
        status: 400,
        msg: "Bad Request."
      }
    };
  }

  const pool = db();
  const query = (await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}"`))[0];
  pool.end();

  if(query) {
    if(query.password === encrypt(password)) {
      console.log(`${PREFIX} User logged: ${Level[query.rank]}:${username}`);

      return {
        done: true,
        data: query,
        error: null
      }
    } else {
      return {
        done: false,
        data: null,
        error: {
          status: 403,
          msg: "Incorrect password."
        }
      };
    }
  } else {
    return {
      done: false,
      data: null,
      error: {
        status: 400,
        msg: "Incorrect name."
      }
    };
  }
}

/**
 * @param {() => import("mysql").Pool} db
 * @param {string?} username
 * @param {string?} email
 * @param {string?} password
 *
 * @returns {Promise<{ done: boolean, data: object | null, error: AccountError | null }>}
*/
async function signup(db, username, email, password) {
}

module.exports = { login, signup };


if(require.main === module) login(null, "Apika Luca", "Pass");
