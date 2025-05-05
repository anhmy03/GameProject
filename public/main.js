"use strict";

window.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("keyup", function () {
      const query = searchBar.value.trim();
      searchGames(query);
    });
  }
});

function searchGames(query) {
  fetch(`/games/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(games => renderGames(games))
    .catch(err => console.error("Search failed:", err));
}

function renderGames(games) {
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = "";

  if (games.length === 0) {
    grid.innerHTML = "<p>No games found.</p>";
    return;
  }

  games.forEach(game => {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("game");

    const h3 = document.createElement("h3");
    h3.textContent = game.title;

    const img = document.createElement("img");
    img.src = game.image;
    img.alt = game.title;

    const price = document.createElement("p");
    price.textContent = `Price: $${game.price}`;

    const viewLink = document.createElement("a");
    viewLink.href = `/games/${game.game_id}`;
    viewLink.textContent = "View Details";

    gameDiv.appendChild(h3);
    gameDiv.appendChild(img);
    gameDiv.appendChild(price);
    gameDiv.appendChild(viewLink);

    grid.appendChild(gameDiv);
  });
}
