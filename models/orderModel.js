"use strict";

const db = require("./db-conn");

function getOrdersByUser(userId) {
  const sql = `
    SELECT o.*, c.card_type, c.card_number
    FROM orders o
    LEFT JOIN card_info c ON o.card_id = c.card_id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC;
  `;
  return db.all(sql, userId);
}

function getOrderItems(orderId) {
  const sql = `
    SELECT oi.*, g.title, g.image
    FROM order_items oi
    JOIN games g ON oi.game_id = g.game_id
    WHERE oi.order_id = ?
  `;
  return db.all(sql, orderId);
}

module.exports = {
  getOrdersByUser,
  getOrderItems
};
