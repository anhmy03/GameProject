"use strict";

(function () {
  window.addEventListener("load", init);

  function init() {
    const gameId = getGameIdFromURL();
    if (!gameId) {
      alert("No game ID provided.");
      return;
    }

    fetch(`/games/${gameId}`)
      .then(checkStatus)
      .then((res) => res.json())
      .then(displayGame)
      .catch((err) => {
        console.error("Error loading game:", err);
        displayError();
      });
  }

  function getGameIdFromURL() {
    const parts = window.location.pathname.split("/");
    return parts[parts.length - 1]; // /games/5 => 5
  }

  function displayGame(game) {
    const container = document.getElementById("game-detail");

    const title = document.createElement("h2");
    title.textContent = game.name;

    const desc = document.createElement("p");
    desc.textContent = game.description;

    const price = document.createElement("p");
    price.textContent = `Price: $${game.price.toFixed(2)}`;

    if (game.image_url) {
      const img = document.createElement("img");
      img.src = game.image_url;
      img.alt = game.name;
      img.style.maxWidth = "300px";
      container.appendChild(img);
    }

    container.appendChild(title);
    container.appendChild(desc);
    container.appendChild(price);
  }

  function displayError() {
    const container = document.getElementById("game-detail");
    container.textContent = "Sorry, game not found.";
  }

  function checkStatus(response) {
    if (!response.ok) {
      throw new Error(`Status code: ${response.status}`);
    }
    return response;
  }
})();
