"use strict";
const db = require("./db-conn");

// Get all products
function getAll() {
  let sql = "SELECT g.id, g.name, g.description, g.image_url, g.price, c.name as category_name " +
        "FROM games g LEFT JOIN Categories c ON g.category_id = c.id;";
  const data = db.all(sql);
  return data;
}

// Get products by one attribute (e.g., category, genre, etc.)
function getAllByOneAttribute(attribute, value) {
  const validColumns = getColumnNames();
  if (validColumns.includes(attribute)) {
    let sql = "SELECT * FROM games WHERE " + attribute + " =?;";
    const data = db.all(sql, value);
    return data;
  }
}

// Get a single product by ID
function getOneById(id) {
  let sql = "SELECT * FROM games WHERE id =?;";
  const item = db.get(sql, id);
  return item;
}

// Delete a game by ID
function deleteGame(id) {
  let sql = "DELETE FROM games WHERE id =?;";
  const info = db.run(sql, id);
  return info;
}

// Create a new game
function createNew(params) {
  let sql = "INSERT INTO games " +
    "(name, platform, release_year, genre, publisher, developer, rating) " +
    "VALUES(?, ?, ?, ?, ?, ?, ?);";
  const info = db.run(sql, params);
  return info;
}

// Get column names for the games table
function getColumnNames() {
  let sql = "SELECT name FROM pragma_table_info('games');";
  const columns = db.all(sql);
  let result = columns.map(a => a.name);
  return result;
}

function updateGame(params) {
  const sql = `
    UPDATE products 
    SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, is_featured = ? 
    WHERE id = ?
  `;
  db.prepare(sql).run(params);
}

function bulkUpload(games) {
  const insert = db.prepare(`
    INSERT INTO products (name, description, image_url, price, category_id, is_featured)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const transaction = db.transaction((games) => {
    for (const game of games) {
      const { name, description, image_url, price, category_id, is_featured } = game;
      insert.run(name, description, image_url, price, category_id, is_featured ? 1 : 0);
    }
  });
  transaction(games);
}

module.exports = {
  getAll,
  getAllByOneAttribute,
  getOneById,
  deleteGame,
  createNew,
  updateGame,
  bulkUpload
};
