const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/all', controller.getAll);
router.get('/:id', controller.getOneById);
router.get('/search', controller.getAllByOneAttribute);
router.get('/delete/:id', controller.deleteGame);
router.post('/create', controller.createNew);


module.exports = router;
