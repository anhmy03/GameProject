const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');

router.get('/user/:userId', controller.viewCart);
router.post('/add', controller.addToCart);
router.post('/remove', controller.removeFromCart);
router.post('/checkout/:userId', controller.checkout);

module.exports = router;
