"use strict";

(function () {
  window.addEventListener("load", init);

  function init() {
    loadGames();

    const newButton = document.getElementById("new-game-btn");
    if (newButton) {
      newButton.addEventListener("click", () => {
        document.getElementById("form-popup").style.display = "block";
      });
    }

    const saveButton = document.getElementById("save-game");
    if (saveButton) {
      saveButton.addEventListener("click", function (e) {
        e.preventDefault();
        submitForm();
      });
    }

    const cancelButton = document.getElementById("cancel-btn");
    if (cancelButton) {
      cancelButton.addEventListener("click", function () {
        document.getElementById("form-container").reset();
        document.getElementById("form-popup").style.display = "none";
      });
    }
  }

  function loadGames() {
    fetch("/games/all")
      .then(checkStatus)
      .then((res) => res.json())
      .then(renderGames)
      .catch((err) => {
        console.error("Failed to load games:", err);
        document.getElementById("items-container").textContent =
          "Failed to load games.";
      });
  }

  function renderGames(games) {
    const container = document.getElementById("items-container");
    container.innerHTML = ""; // Clear if needed

    games.forEach((game) => {
      const article = document.createElement("article");
      article.classList.add("item");

      const div = document.createElement("div");
      div.classList.add("text");

      const title = document.createElement("h3");
      title.textContent = `${game.id}: ${game.name}`;

      const desc = document.createElement("p");
      desc.textContent = game.description || "No description available.";

      const price = document.createElement("p");
      price.textContent = `Price: $${game.price.toFixed(2)}`;

      const detailLink = document.createElement("a");
      detailLink.href = `/games/${game.id}`;
      detailLink.textContent = "View";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-game");
      deleteBtn.setAttribute("id", game.id);
      deleteBtn.addEventListener("click", () => deleteGame(game.id));

      div.appendChild(title);
      div.appendChild(desc);
      div.appendChild(price);
      div.appendChild(detailLink);
      div.appendChild(deleteBtn);
      article.appendChild(div);
      container.appendChild(article);
    });
  }

  function submitForm() {
    const formData = new FormData(document.getElementById("form-container"));
    const jsonBody = JSON.stringify(Object.fromEntries(formData.entries()));

    fetch("/games/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonBody,
    })
      .then(checkStatus)
      .then(() => location.reload())
      .catch(alert);
  }

  function deleteGame(gameId) {
    fetch(`/games/delete/${gameId}`, {
      method: "DELETE",
    })
      .then(checkStatus)
      .then(() => location.reload())
      .catch(alert);
  }

  function checkStatus(response) {
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response;
  }
})();
