"use strict";
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel"); // in case you need product info when adding

// View the current user's cart
function viewCart(req, res) {
  const userId = req.params.userId;

  if (!userId) return res.status(400).json({ error: 'Missing user ID' });

  const cartItems = cartModel.getCartByUserId(req.params.userId);
  res.render('cart', { items: cartItems, userId }); 
}
// Add a game to the cart
function addToCart(req, res) {
  const userId = req.params.userId;
  const { gameId, quantity } = req.body;

  if (!userId) return res.status(401).json({ error: 'User not logged in' });
  if (!gameId || !quantity) return res.status(400).json({ error: 'Missing data' });

  cartModel.addToCart(userId, parseInt(gameId), parseInt(quantity));
  res.redirect('/cart'); // or res.json({ message: 'Added to cart' });
}

// Remove a game from the cart
function removeFromCart(req, res) {
  const userId = req.query.userId;
  const gameId = req.query.gameId;

  if (!userId) return res.status(401).json({ error: 'User not logged in' });

  cartModel.removeFromCart(userId, gameId);
  res.redirect(`/cart/user/${userId}`);
}

// Checkout the cart
function checkout(req, res) {
  const userId = req.params.userId;

  if (!userId) return res.status(401).json({ error: 'User not logged in' });

  cartModel.checkout(userId);
  res.redirect(`/cart/user/${userId}`);
}

module.exports = {
  viewCart,
  addToCart,
  removeFromCart,
  checkout
};