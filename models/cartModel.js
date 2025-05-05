"use strict";

const db = require("./db-conn");

// Create cart if doesn't exist
function ensureCart(userId) {
  let cart = db.get("SELECT * FROM cart WHERE user_id = ?", userId);
  if (!cart) {
    db.run("INSERT INTO cart (user_id, created_at) VALUES (?, datetime('now'))", userId);
    cart = db.get("SELECT * FROM cart WHERE user_id = ?", userId);
  }
  return cart;
}

// Add to cart
function addToCart(userId, gameId, quantity = 1) {
  const cart = ensureCart(userId);

  // Check if there's an active item (NOT purchased)
  const existing = db.get(`
    SELECT * FROM cart_items 
    WHERE cart_id = ? AND game_id = ? AND status = 'active'
  `, cart.cart_id, gameId);

  if (existing) {
    // If already in cart, just update quantity
    db.run(`
      UPDATE cart_items 
      SET quantity = quantity + ? 
      WHERE cart_item_id = ?
    `, quantity, existing.cart_item_id);
  } else {
    // Allow re-adding even if previously purchased
    db.run(`
      INSERT INTO cart_items (cart_id, game_id, quantity, status)
      VALUES (?, ?, ?, 'active')
    `, cart.cart_id, gameId, quantity);
  }
}


// View cart
function getCartItems(userId) {
  const sql = `
    SELECT g.*, ci.quantity, ci.cart_item_id
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.cart_id
    JOIN games g ON ci.game_id = g.game_id
    WHERE c.user_id = ? AND ci.status = 'active';
  `;
  return db.all(sql, userId);
}

// Checkout
function checkoutCart(userId) {
    const cart = ensureCart(userId);
    
    //Get all active cart items
    const activeItems = db.all(`
      SELECT ci.cart_item_id, ci.game_id, ci.quantity, g.price
      FROM cart_items ci
      JOIN games g ON ci.game_id = g.game_id
      WHERE ci.cart_id = ? AND ci.status = 'active';
    `, cart.cart_id);
  
    if (activeItems.length === 0) {
      return;
    }
  
    // Create a new order
    const orderResult = db.run(
      "INSERT INTO orders (user_id, payment_method) VALUES (?, 'Card')",
      userId
    );
    const orderId = orderResult.lastInsertRowid;
  
    // Move each active cart_item to order_items
    for (const item of activeItems) {
      db.run(
        "INSERT INTO order_items (order_id, game_id, quantity, price) VALUES (?, ?, ?, ?)",
        orderId,
        item.game_id,
        item.quantity,
        item.price
      );
    }
  
    // Mark those cart items as purchased
    db.run(
      "UPDATE cart_items SET status = 'purchased' WHERE cart_id = ?",
      cart.cart_id
    );
  
}

function removeCartItem(cartItemId) {
  db.run("DELETE FROM cart_items WHERE cart_item_id = ?", cartItemId);
}

function updateCartItemQuantity(cartItemId, quantity) {
  db.run("UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?", quantity, cartItemId);
}

function getCartTotal(userId) {
  const sql = `
    SELECT SUM(ci.quantity * g.price) AS total
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.cart_id
    JOIN games g ON ci.game_id = g.game_id
    WHERE c.user_id = ? AND ci.status = 'active'
  `;
  const row = db.get(sql, userId);
  return row?.total || 0;
}

module.exports = {
  addToCart,
  getCartItems,
  checkoutCart,
  removeCartItem,
  updateCartItemQuantity,
  getCartTotal
};
