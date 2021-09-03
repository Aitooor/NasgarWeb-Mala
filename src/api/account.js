
const PREFIX = "\x1b[0;1;31m[ACCOUNTS] \x1b[0;37m";

async function login(db, username, password) {
	if(typeof username != "string" || 
        username?.match?.(/^\s*$/) !== null ||
        typeof password != "string" || 
        password?.match?.(/^\s*$/) !== null ) 
    {
        return { done: false, error: null };
    }

    /*const pool = await db();
    const query = await pool.query(`SELECT * FROM web.accounts WHERE name = "${username}" AND password = "${password}"`);

	pool.end();//*/

    const query = {uuid:"uuid"}

	console.log(`${PREFIX}User logged: ${query.uuid}:${username}`);

    return 
}

async function signup(db, username, password) {

}

module.exports = { login, signup };


if(require.main === module) login(null, "Apika Luca", "Pass");
