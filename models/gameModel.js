"use strict";

const db = require("./db-conn");

// Get all games
function getAll() {
  const sql = "SELECT * FROM games;";
  return db.all(sql);
}

// Get one game by ID
function getById(gameId) {
  const sql = "SELECT * FROM games WHERE game_id = ?;";
  return db.get(sql, gameId);
}

// Add new game (used for full form)
function createNew({ title, price, genre, platform, developer, release_date, category, image }) {
  const sql = `
    INSERT INTO games (title, price, genre, platform, developer, release_date, category, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, title, price, genre, platform, developer, release_date, category, image);
}

// Update game (for edit form)
function updateGame(gameId, { title, price, genre, platform, developer, release_date, category, image }) {
  const sql = `
    UPDATE games
    SET title = ?, price = ?, genre = ?, platform = ?, developer = ?, release_date = ?, category = ?, image = ?
    WHERE game_id = ?;
  `;
  return db.run(sql, title, price, genre, platform, developer, release_date, category, image, gameId);
}

// Delete game
function deleteGame(gameId) {
  const sql = "DELETE FROM games WHERE game_id = ?;";
  return db.run(sql, gameId);
}

// Bulk upload insert (used by admin file upload)
function bulkInsert(games) {
  const sql = `
    INSERT INTO games (title, price, genre, platform, developer, release_date, category, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const g of games) {
    try {
      db.run(sql, g.title, g.price, g.genre, g.platform, g.developer, g.release_date, g.category, g.image);
    } catch (err) {
      console.error(`Failed to insert "${g.title}":`, err.message);
      // optionally continue or throw
    }
  }
}


// Admin search/filter logic
function searchAdminGames(search, category) {
  let sql = "SELECT * FROM games WHERE 1=1";
  const params = [];

  if (search) {
    sql += " AND title LIKE ?";
    params.push(`%${search}%`);
  }

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }

  sql += " ORDER BY game_id DESC";
  return db.all(sql, ...params);
}

// Get unique category list
function getAllCategories() {
  const rows = db.all("SELECT DISTINCT category FROM games ORDER BY category ASC");
  return rows.map(r => r.category);
}

module.exports = {
  getAll,
  getById,
  createNew,
  updateGame,
  deleteGame,
  bulkInsert,
  searchAdminGames,
  getAllCategories
};
