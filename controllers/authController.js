"use strict";

const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");

// Render signup page
function showSignupForm(req, res) {
  res.render("signup");
}

// Handle signup form
async function signup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    await authModel.createUser(username, email, password);
    res.redirect("/login");
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send("Error creating user.");
  }
}

// Render login page
function showLoginForm(req, res) {
  res.render("login");
}

// Handle login form
async function login(req, res) {
  const { email, password } = req.body;
  const user = authModel.findUserByEmail(email);

  if (!user) {
    res.redirect("/login");
    return res.status(400).send("No user with that email.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.redirect("/login");
    return res.status(400).send("Incorrect password.");
  }

  const isAdmin = authModel.isAdmin(user.user_id);

  // Save user info into session
  req.session.user = {
    id: user.user_id,
    username: user.username,
    email: user.email,
    isAdmin: isAdmin ? true : false

  };

  res.redirect("/games");
}

// Logout
function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

module.exports = {
  showSignupForm,
  signup,
  showLoginForm,
  login,
  logout
};
