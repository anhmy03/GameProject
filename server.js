"use strict";

const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// Route Modules
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// DB cleanup utility
const { db_close } = require('./models/db-conn');

const app = express();

// Set public directory for static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: false
}));

// === ROUTES ===
app.use('/', authRoutes);
app.use('/games', gameRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);

// === START SERVER ===
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});

// === CLEANUP ON EXIT ===
process.on("SIGINT", () => {
  console.log("Terminate signal received.");
  db_close();
  console.log("...Closing HTTP server.");
  server.close(() => {
    console.log("...HTTP server closed.");
  });
});
