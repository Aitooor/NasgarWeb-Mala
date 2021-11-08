const { v4 } = require("uuid");

/****************************************/
/***             Products             ***/
/****************************************/

/** @typedef {{ uuid: string, name: string, description: string, price: number, exec_cmd: string, exec_params: string, images: string[] | null, created: number }} ItemData */
/** @typedef {{ uuid: string, name: string, description: string, price: number, exec_cmd: string, exec_params: string, images: string, created: number }} ItemDataCrude */

/**
 * @param {ItemDataCrude} old
 * @returns {ItemData}
 */
function parseProduct(old) {
  return {
    ...old,
    images: JSON.parse(old.images),
  };
}

/**
 * @param {ItemData} old
 * @returns {ItemDataCrude}
 */
function stringifyProduct(old) {
  return {
    ...old,
    images: JSON.stringify(old.images),
  };
}

/**
 * @param {()=>import('mysql').Pool} db
 * @returns {Promise<ItemData[]>}
 */
async function getAllProducts(db) {
  const pool = db();
  const query = await pool.query("SELECT * FROM web.products");
  pool.end();

  return query.map(parseProduct);
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {string} category
 * @returns {Promise<ItemData[]>}
 */
async function getAllProductsFrom(db, category) {
  const pool = db();
  const query = await pool.query(
    `SELECT * FROM web.product WHERE category = "${category.toLowerCase()}"`
  );
  pool.end();

  return query.map(parseProduct);
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {string} uuid
 * @returns {Promise<ItemData>}
 */
async function getProduct(db, uuid) {
  const pool = db();
  try {
    const query = await pool.query(
      "SELECT * FROM web.products WHERE uuid = ?",
      uuid
    );
    pool.end();

    if (!query[0]) return null;

    return parseProduct(query[0]) ?? null;
  } catch (e) {
    pool.end();
    console.error(e);

    return null;
  }
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {ItemData} data
 * @returns {Promise<boolean>}
 */
async function updateProduct(db, data) {
  const pool = db();
  try {
    await pool.query(`UPDATE web.products SET ? WHERE uuid = "${data.uuid}"`, [
      stringifyProduct(data),
    ]);

    return true;
  } catch (e) {
    pool.end();
    console.error(e);

    return false;
  }
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {ItemData} data
 * @returns {Promise<boolean>}
 */
async function addProduct(db, data) {
  const pool = db();
  try {
    data.uuid = v4();
    data.created = Date.now();
    await pool.query(`INSERT INTO web.products SET ? `, [
      stringifyProduct(data),
    ]);

    return true;
  } catch (e) {
    pool.end();
    console.error(e);

    return false;
  }
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {string} uuid
 */
async function delProduct(db, uuid) {
  const pool = db();
  try {
    const res = await pool.query(
      `DELETE FROM web.products WHERE uuid = "${uuid}"`
    );

    if (res.length === 0) return false;

    return true;
  } catch (e) {
    pool.end();
    console.error(e);

    return false;
  }
}

/**
 * @param {()=>import('mysql').Pool} _db
 * @param {string} cupon
 * @returns {Promise<{cupon: string, valid: boolean, modify?: number}>}
 */
async function getCupon(_db, cupon) {
  cupon = cupon.toUpperCase();

  if (cupon === "TEST-CUPON") {
    return {
      cupon,
      valid: true,
      modify: 0.25,
    };
  } else {
    return {
      cupon,
      valid: false,
      modify: 0,
    };
  }
}

/****************************************/
/***            Categories            ***/
/****************************************/

/** @typedef {{ uuid: string, name: string, display: string, description: string, order: string[], show: number, image: string, min_rank: number }} Category */
/** @typedef {{ uuid: string, name: string, display: string, description: string, order: string,   show: number, image: string, min_rank: number }} CategoryCrude */

/**
 *
 * @param {CategoryCrude} category
 * @return {Category}
 */
function parseCategory(category) {
  return {
    ...category,
    order: JSON.parse(category.order),
  };
}

/**
 *
 * @param {Category} category
 * @returns {CategoryCrude}
 */
function stringifyCategory(category) {
  return {
    ...category,
    order: JSON.stringify(category.order),
  };
}

/**
 * @param {()=>import('mysql').Pool} db
 * @returns {Promise<Category[]>}
 */
async function getAllCategories(db) {
  const pool = db();
  const query = await pool.query("SELECT * FROM web.categories");
  pool.end();

  return query.map(parseCategory);
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {string} uuid
 * @returns {Promise<Category>}
 */
async function getCategory(db, uuid) {
  const pool = db();
  try {
    const query = await pool.query(
      "SELECT * FROM web.categories WHERE uuid = ?",
      uuid
    );
    pool.end();

    if (!query[0]) return null;

    return parseCategory(query[0]) ?? null;
  } catch (e) {
    pool.end();
    console.error(e);

    return null;
  }
}

/**
 * @param {()=>import('mysql').Pool} db
 * @param {Category} data
 * @returns {Promise<boolean>}
 */
async function addCategory(db, data) {
  const pool = db();
  try {
    data.uuid = v4();
    await pool.query(`INSERT INTO web.categories SET ? `, [
      stringifyCategory(data),
    ]);
    pool.end();

    return true;
  } catch (e) {
    pool.end();
    console.error(e);

    return false;
  }
}

module.exports = {
  getAllProducts,
  getAllProductsFrom,
  getProduct,
  getCupon,
  updateProduct,
  addProduct,
  delProduct,

  getAllCategories,
  getCategory,
  addCategory,
};
