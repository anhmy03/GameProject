"use strict";

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { ensureLoggedIn } = require("../middleware/authMiddleware");

// Add to cart
router.post("/add/:id", ensureLoggedIn, cartController.addToCart);

// View cart
router.get("/", ensureLoggedIn, cartController.viewCart);

// Checkout
router.post("/checkout", ensureLoggedIn, cartController.checkout);

router.post("/update", ensureLoggedIn, cartController.updateQuantity);
router.post("/remove", ensureLoggedIn, cartController.removeFromCart);



module.exports = router;
