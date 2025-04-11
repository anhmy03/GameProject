const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/all', controller.getAll);
router.get('/:id', controller.geactiontOneById);
router.get('/search?attribute=category&value=action', controller.getAllByOneAttribute);
router.get('/delete/:id', controller.deleteGame);


module.exports = router;
