const express = require("express");
const passport = require("passport");
const router = express.Router();
const authModel = require("../models/authModel");

router.get("/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      keepSessionInfo: true
    })
  );
  
router.get("/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      keepSessionInfo: true
    }),
    async (req, res) => {
      // Manually check if the user is admin via admin table
      const isAdmin = await authModel.isAdmin(req.user.user_id);
  
      // Set session.user manually
      req.session.user = {
        id: req.user.user_id,
        username: req.user.username,
        email: req.user.email,
        isAdmin: !!isAdmin
      };
  
      res.redirect("/games");
    }
  );
  
  module.exports = router;