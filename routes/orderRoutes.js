"use strict";

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { ensureLoggedIn } = require("../middleware/authMiddleware");

router.get("/", ensureLoggedIn, orderController.viewOrderHistory);

module.exports = router;
