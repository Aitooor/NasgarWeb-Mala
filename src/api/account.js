const { encrypt } = require("../lib/pass");
const { Level } = require("../@types/userLevel");
const { ErrorCode, errorDesc } = require("../@types/errorCodes");
const uuid = require("uuid");

const PREFIX = "\x1b[0;1;31m[ACCOUNTS] \x1b[0;37m";

/** @typedef {{ status: number, code: ErrorCode, msg: string, [k: string]: any }} AccountError */

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
        code: ErrorCode.EAcInvalidArgs,
        msg: errorDesc.EAcInvalidArgs
      }
    };
  }

  const pool = db();
  const query = (await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}"`))[0];
  pool.end();

  if(query) {
    if(query.password === encrypt(password)) {
      if(query.emailVerified !== 1) {
        return {
          done: false,
          data: null,
          error: {
            status: 403,
            code: ErrorCode.EAcNoVerified,
            msg: errorDesc.EAcNoVerified
          }
        }
      }

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
          code: ErrorCode.EAcIncorrect,
          msg: errorDesc.EAcIncorrect
        }
      };
    }
  } else {
    return {
      done: false,
      data: null,
      error: {
        status: 403,
        code: ErrorCode.EAcIncorrect,
        msg: errorDesc.EAcIncorrect
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
  // Verify types and content
  if(typeof username != "string" || username?.match?.(/^\s*$/) !== null || username?.length > 30 ||
     typeof password != "string" || password?.match?.(/^\s*$/) !== null ||
    typeof email != "string" || email?.match?.(/^[a-z0-9]+(?:\.[a-z0-9]+)*@[a-z0-9]{2,}(\.[a-z0-9]{2,})+$/i) === null ) {
    return {
      done: false,
      data: null,
      error: {
        status: 400,
        code: ErrorCode.EAcInvalidArgs,
        msg: errorDesc.EAcInvalidArgs
      }
    }
  }

  // Query a user with same name or email
  const pool = db();
  const query = await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}" OR email = "${email}" LIMIT 1`);

  // If that user not exists then sigup
  // else close pool connection and return error
  if(query.length === 0) {
    const _uuid = uuid.v4();
    await pool.query("INSERT INTO web.accounts SET ?", { uuid: _uuid, name: username, email: email, password: encrypt(password), rank: Level.User });

    console.log(`[ACCOUNTS] New user register: ${_uuid}:${username} `);
    pool.end();

    return {
      done: true,
      data: _uuid,
      error: null
    }
  } else {
    pool.end();
    
    return {
      done: false,
      data: null,
      error: {
        status: 400,
        code: ErrorCode.EAcExists,
        msg: errorDesc.EAcExists
      }
    }
  }
}

module.exports = { login, signup };

