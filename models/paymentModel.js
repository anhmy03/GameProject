"use strict";
const db = require("./db-conn");

function addPaymentMethod(userId, cardNumber, cardHolder, expiryDate, cardType) {
  db.run(`
    INSERT INTO card_info (user_id, card_number, card_holder, expiry_date, card_type)
    VALUES (?, ?, ?, ?, ?)
  `, userId, cardNumber, cardHolder, expiryDate, cardType);
}

function getUserCards(userId) {
  return db.all("SELECT * FROM card_info WHERE user_id = ?", userId);
}

module.exports = { addPaymentMethod, getUserCards };
