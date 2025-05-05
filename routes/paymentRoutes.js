const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");
const { ensureLoggedIn } = require("../middleware/authMiddleware");

router.get("/add", ensureLoggedIn, controller.showAddPaymentForm);
router.post("/add", ensureLoggedIn, controller.addPaymentMethod);

module.exports = router;
