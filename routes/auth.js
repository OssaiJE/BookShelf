const express = require("express");
const passport = require("passport");
const router = express.Router();


// @desc Auth with google
// @route Get /auth/google
router.get("/google", passport.authenticate('google', { scope: ['profile']}));

// @desc Dashboard
// @route Get /dashboard
router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});




module.exports = router;