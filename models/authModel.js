"use strict";

const db = require("./db-conn");
const bcrypt = require("bcrypt");

// Create new user (Signup)
async function createUser(username, email, password) {
  const hash = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `;
  db.run(sql, username, email, hash);
}

// Find user by email (Login)
function findUserByEmail(email) {
  const sql = `
    SELECT * FROM users WHERE email = ?
  `;
  return db.get(sql, email);
}

function isAdmin(userId) {
    const sql = `
      SELECT * FROM admins WHERE user_id = ?
    `;
    const admin = db.get(sql, userId);
    return admin ? true : false;
  }

module.exports = {
  createUser,
  findUserByEmail,
  isAdmin
};
