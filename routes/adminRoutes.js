const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');


router.post('/create', controller.createNew);
router.post('/update/:id', controller.updateGame);
router.post('/bulk-upload', controller.bulkUpload);

module.exports = router;
