
function parseProduct(old) {
    return {
        ...old,
        images: JSON.parse(old.images)
    }
}

async function getAllProducts(db) {
	const pool = await db();
	const query = await pool.query("SELECT * FROM web.products");
	pool.end();

	return query.map(parseProduct);
}

async function getProduct(db, uuid) {
	const pool = await db();
	try {
		const query = await pool.query("SELECT * FROM web.products WHERE uuid = ?", uuid);
		pool.end();

        console.log(`[SHOP] Get "${uuid}":`, JSON.parse(JSON.stringify(query[0])));

		return parseProduct(query[0]) ?? null;
	} catch(e) {
		pool.end();
		console.error(e);
		
		return null;
	}
}

module.exports = { 
	getAllProducts, 
	getProduct 
};
