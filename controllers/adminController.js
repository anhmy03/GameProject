const fs = require("fs");
const path = require("path");
const gameModel = require("../models/gameModel");

// ====== Bulk Upload Page ======
function showUploadPage(req, res) {
  res.render("admin-upload", { user: req.session.user });
}

function handleUpload(req, res) {
    if (!req.file) return res.status(400).send("No file uploaded");
  
    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const ext = path.extname(req.file.originalname).toLowerCase();
  
    try {
      const content = fs.readFileSync(filePath, "utf-8");
  
      let games;
      if (ext === ".json") {
        games = JSON.parse(content);
      } else {
        return res.status(400).send("Only JSON format is supported.");
      }
  
      gameModel.bulkInsert(games);
      res.redirect(`/admin/upload?success=${encodeURIComponent("Upload successful! Inserted " + games.length + " games.")}`);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).send("Failed to process upload.");
    }
  }

// ====== Product List ======
function getProductsPage(req, res) {
  const search = req.query.search || "";
  const category = req.query.category || "";

  const games = gameModel.searchAdminGames(search, category);
  const categories = gameModel.getAllCategories();

  res.render("admin-products", {
    games,
    searchQuery: search,
    selectedCategory: category,
    categories,
    user: req.session.user
  });
}

// ====== Edit Product ======
function editProductPage(req, res) {
  const id = req.params.id;
  const game = gameModel.getById(id);
  if (!game) return res.status(404).send("Game not found");

  res.render("product-edit", { game, user: req.session.user });
}

function updateProduct(req, res) {
    const id = req.params.id;
    const {
      title,
      price,
      genre,
      platform,
      developer,
      release_date,
      category,
    } = req.body;
  
    let image = req.file ? `/images/${req.file.filename}` : req.body.existingImage;
  
    gameModel.updateGame(id, {
      title,
      price,
      genre,
      platform,
      developer,
      release_date,
      category,
      image,
    });
  
    res.redirect("/admin/products");
  }
  
// ====== Delete ======
function deleteProduct(req, res) {
  const id = req.params.id;
  gameModel.deleteGame(id);
  res.redirect("/admin/products");
}


// ====== Add New Product ======
function newProductPage(req, res) {
  res.render("product-add", { game: null, user: req.session.user }); // Reuse same view
}

function createNewProduct(req, res) {
    const { title, price, genre, platform, developer, release_date, category } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : "";
  
    gameModel.createNew({
      title,
      price,
      genre,
      platform,
      developer,
      release_date,
      category,
      image
    });
  
    res.redirect("/admin/products");
  }

module.exports = {
  showUploadPage,
  handleUpload,
  getProductsPage,
  editProductPage,
  updateProduct,
  deleteProduct,
  newProductPage,
  createNewProduct
};
