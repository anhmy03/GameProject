"use strict";
const db = require("./db-conn");

function getCartByUserId(userId) {
  let sql = `
    SELECT u.name as username, cp.id, g.name, g.price, cp.quantity
    FROM cart_products cp
    Left JOIN games g ON cp.game_id = g.id
    Left JOIN carts c ON cp.cart_id = c.id
    Left JOIN users u ON c.user_id = u.id
    WHERE c.user_id = ?`;
   
  return db.all(sql, userId);
}

function addToCart(userId, gameId, quantity) {
  // Ensure the user has a cart first
  let cart = db.get("SELECT * FROM carts WHERE user_id = ? AND status = 'new';", userId);
  if (!cart) {
    db.run("INSERT INTO carts (user_id) VALUES (?);", userId);
    cart = db.get("SELECT * FROM carts WHERE user_id = ? AND status = 'new';", userId);
  }

  // Check if game already in cart
  let existing = db.get(
    "SELECT * FROM cart_products WHERE cart_id = ? AND game_id = ?;",
    cart.id,
    gameId
  );

  if (existing) {
    let newQty = existing.quantity + quantity;
    db.run("UPDATE cart_products SET quantity = ? WHERE id = ?;", newQty, existing.id);
  } else {
    db.run(
      "INSERT INTO cart_products (cart_id, game_id, quantity) VALUES (?, ?, ?);",
      cart.id,
      gameId,
      quantity
    );
  }

  return { message: "Added to cart" };
}

function removeFromCart(userId, gameId) {
  let cart = db.get("SELECT * FROM carts WHERE user_id = ? AND status = 'new';", userId);
  if (cart) {
    let cartItem = db.get(
      "SELECT * FROM cart_products WHERE cart_id = ? AND game_id = ?;",userId,gameId);
    db.run("DELETE FROM cart_products cp WHERE cp.id = ?", cartItem.id);
  }
}

function checkout(userId) {
  let cart = db.get("SELECT * FROM carts WHERE user_id = ? AND status = 'new';", userId);
  if (cart) {
    db.run("UPDATE carts SET status = 'purchased' WHERE id = ?;", cart.id);
  }
}

module.exports = {
  getCartByUserId,
  addToCart,
  removeFromCart,
  checkout
};
