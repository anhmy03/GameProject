"use strict";

const gameModel = require("../models/gameModel");

// Get all games
function listGames(req, res) {
  const gamesList = gameModel.getAll();
  res.render("games", { games: gamesList, user: req.session.user });
}

// Search games
function searchGames(req, res) {
    const query = req.query.q || "";
    const allGames = gameModel.getAll();
    const filteredGames = allGames.filter(game => 
      game.title.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filteredGames);
  }

function listGamesByCategory(req, res) {
    const category = req.params.categoryName;
    const allGames = gameModel.getAll();
    const filteredGames = allGames.filter(game => 
      game.category.toLowerCase() === category.toLowerCase()
    );
    res.render("games", { games: filteredGames, user: req.session.user });
  }
  

// View one game's details
function viewGame(req, res) {
  const gameId = req.params.id;
  const game = gameModel.getById(gameId);
  if (!game) {
    return res.status(404).send("Game not found");
  }
  res.render("game-detail", { game, user: req.session.user });
}

// Admin add new game (show form)
function showAddGameForm(req, res) {
  res.render("admin-add-game", { user: req.session.user });
}

// Admin save new game
function addGame(req, res) {
  const { title, price, genre, platform, developer, release_date, category, image } = req.body;
  gameModel.addGame({ title, price, genre, platform, developer, release_date, category, image });
  res.redirect("/games");
}

// Admin edit game (show form)
function showEditGameForm(req, res) {
  const gameId = req.params.id;
  const game = gameModel.getById(gameId);
  if (!game) {
    return res.status(404).send("Game not found");
  }
  res.render("admin-edit-game", { game, user: req.session.user });
}

// Admin save edited game
function editGame(req, res) {
  const gameId = req.params.id;
  const { title, price, genre, platform, developer, release_date, category, image } = req.body;
  gameModel.editGame(gameId, { title, price, genre, platform, developer, release_date, category, image });
  res.redirect("/games");
}

// Admin delete game
function deleteGame(req, res) {
  const gameId = req.params.id;
  gameModel.deleteGame(gameId);
  res.redirect("/games");
}

module.exports = {
  listGames,
  listGamesByCategory,
  searchGames,
  viewGame,
  showAddGameForm,
  addGame,
  showEditGameForm,
  editGame,
  deleteGame
};
