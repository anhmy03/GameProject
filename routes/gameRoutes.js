"use strict";

const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// Show all games
router.get("/", gameController.listGames);

// Search games
router.get("/search", gameController.searchGames);

// Show games by category
router.get("/category/:categoryName", gameController.listGamesByCategory);

// View one game details
router.get("/:id", gameController.viewGame);

// Admin add game
router.get("/admin/add", gameController.showAddGameForm);
router.post("/admin/add", gameController.addGame);

// Admin edit game
router.get("/admin/edit/:id", gameController.showEditGameForm);
router.post("/admin/edit/:id", gameController.editGame);

// Admin delete game
router.post("/admin/delete/:id", gameController.deleteGame);

module.exports = router;
