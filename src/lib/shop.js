
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

    if(!query[0]) return null;

		return parseProduct(query[0]) ?? null;
	} catch(e) {
		pool.end();
		console.error(e);
		
		return null;
	}
}

async function getCupon(db, cupon) {
  cupon = cupon.toUpperCase();

  if(cupon === "TEST-CUPON") {
    return {
      cupon,
      valid: true,
      modify: .25
    };
  } else {
    return {
      cupon,
      valid: false
    };
  }
}

module.exports = { 
	getAllProducts, 
	getProduct,
  getCupon
};
