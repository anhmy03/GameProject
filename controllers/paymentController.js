"use strict";
const paymentModel = require("../models/paymentModel");

function showAddPaymentForm(req, res) {
  res.render("add-payment", { user: req.session.user });
}

function addPaymentMethod(req, res) {
  const userId = req.session.user.id;
  const { cardNumber, cardHolder, expiryDate, cardType } = req.body;
  paymentModel.addPaymentMethod(userId, cardNumber, cardHolder, expiryDate, cardType);
  res.redirect("/cart");
}

module.exports = { showAddPaymentForm, addPaymentMethod };
