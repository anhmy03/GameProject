"use strict";

(function () {
  window.addEventListener("load", init);

  function init() {
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", handleCheckout);
    }
  }

  async function handleCheckout(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      await checkStatus(res);

      clearCartUI();
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  function clearCartUI() {
    const table = document.querySelector("table");
    if (table) table.remove();

    const total = document.querySelector("h3");
    if (total) total.textContent = "Your cart is now empty. Thank you for your purchase!";

    const form = document.getElementById("checkoutForm");
    if (form) form.remove();
  }

  function checkStatus(response) {
    if (!response.ok) {
      throw new Error(`Status code: ${response.status}`);
    }
    return response;
  }
})();
