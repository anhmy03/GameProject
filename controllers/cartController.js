"use strict";

const cartModel = require("../models/cartModel");
const paymentModel = require("../models/paymentModel");
// Add to Cart
function addToCart(req, res) {
  const userId = req.session.user.id;
  const gameId = req.params.id;
  cartModel.addToCart(userId, gameId);
  res.redirect("/games");
}

// View Cart
function viewCart(req, res) {
  const userId = req.session.user.id;
  const cartItems = cartModel.getCartItems(userId);
  const total = cartModel.getCartTotal(userId);
  const paymentMethods = paymentModel.getUserCards(userId); // We'll define next
  res.render("cart", { cartItems, total, paymentMethods, user: req.session.user });
}


// Checkout Cart
function checkout(req, res) {
  const userId = req.session.user.id;
  const paymentMethodId = req.body.paymentMethodId;

  if (!paymentMethodId) {
    return res.redirect("/payment/add");
  }

  cartModel.checkoutCart(userId, paymentMethodId); // assume model stores card ID
  res.redirect("/orders");
}


function updateQuantity(req, res) {
  const { cart_item_id, quantity } = req.body;
  cartModel.updateCartItemQuantity(cart_item_id, quantity);
  res.redirect("/cart");
}

function removeFromCart(req, res) {
  const { cart_item_id } = req.body;
  cartModel.removeCartItem(cart_item_id);
  res.redirect("/cart");
}


module.exports = {
  addToCart,
  viewCart,
  checkout,
  removeFromCart,
  updateQuantity
};
