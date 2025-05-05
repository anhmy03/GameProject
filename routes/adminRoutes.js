const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const adminController = require("../controllers/adminController");

// ===== Multer Config to Save to /public/images =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images")); // Save to public/images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// ===== Bulk Upload (JSON File) =====
router.get("/upload", adminController.showUploadPage);
router.post("/upload", multer({ dest: path.join(__dirname, "../uploads") }).single("file"), adminController.handleUpload);

// ===== Product Listing =====
router.get("/products", adminController.getProductsPage);

// ===== Product Edit =====
router.get("/products/edit/:id", adminController.editProductPage);
router.post("/products/edit/:id", upload.single("image"), adminController.updateProduct);

// ===== Product Delete =====
router.post("/products/delete/:id", adminController.deleteProduct);

// ===== Add New Product =====
router.get("/products/new", adminController.newProductPage);
router.post("/products/new", upload.single("image"), adminController.createNewProduct);

module.exports = router;
