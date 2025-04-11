"use strict";
const model = require("../models/productModel");

// Get all games
function getAll(req, res, next) {
  try {
    const gamesList = model.getAll();
    res.render("games", { gamesList: gamesList, title: "All Games" });
  } catch (err) {
    console.error("Error while getting games: ", err.message);
    next(err);
  }
}

// Filter games by one attribute (e.g., category, name)
function getAllByOneAttribute(req, res, next) {
  const { attribute, value } = req.query;
  if (attribute && value) {
    try {
      const gamesList = model.getAllByOneAttribute(attribute, value);
      res.render("games", { gamesList: gamesList, title: `${value} Games` });
    } catch (err) {
      console.error("Error while filtering games: ", err.message);
      next(err);
    }
  } else {
    res.status(400).send("Invalid Request");
  }
}

// Get one game by ID
function getOneById(req, res, next) {
  try {
    const game = model.getOneById(req.params.id);
    res.render("game-details", { game: game, title: `Game #${req.params.id}` });
  } catch (err) {
    console.error("Error while getting game by ID: ", err.message);
    next(err);
  }
}

// Delete a game by ID
function deleteGame(req, res, next) {
  try {
    model.deleteGame(req.params.id);
    const gamesList = model.getAll();
    res.render("games", { gamesList: gamesList, title: "All Games" });
  } catch (err) {
    console.error("Error while deleting game: ", err.message);
    next(err);
  }
}

// Add a new game
function createNew(req, res, next) {
  const { name, description, image_url, price, category_id, is_featured } = req.body;

  if (name && price && category_id) {
    const params = [name, description, image_url, price, category_id, is_featured ? 1 : 0];
    try {
      model.createNew(params);
      const gamesList = model.getAll();
      res.render("games", { gamesList: gamesList, title: "All Games" });
    } catch (err) {
      console.error("Error while creating game: ", err.message);
      next(err);
    }
  } else {
    res.status(400).send("Missing required fields.");
  }
}

// Update an existing game
function updateGame(req, res, next) {
  const { id } = req.params;
  const { name, description, image_url, price, category_id, is_featured } = req.body;

  if (id && name && price && category_id) {
    const params = [name, description, image_url, price, category_id, is_featured ? 1 : 0, id];
    try {
      model.updateGame(params);
      const gamesList = model.getAll();
      res.render("games", { gamesList: gamesList, title: "All Games" });
    } catch (err) {
      console.error("Error while updating game: ", err.message);
      next(err);
    }
  } else {
    res.status(400).send("Missing required fields.");
  }
}

// Bulk upload games from JSON
function bulkUpload(req, res, next) {
  const { games } = req.body;

  if (Array.isArray(games)) {
    try {
      model.bulkUpload(games);
      const gamesList = model.getAll();
      res.render("games", { gamesList: gamesList, title: "All Games" });
    } catch (err) {
      console.error("Error during bulk upload: ", err.message);
      next(err);
    }
  } else {
    res.status(400).send("Invalid input: expected an array of games.");
  }
}

module.exports = {
  getAll,
  getAllByOneAttribute,
  getOneById,
  deleteGame,
  createNew,
  updateGame,
  bulkUpload
};
