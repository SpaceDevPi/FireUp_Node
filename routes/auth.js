const express = require("express");
const passport = require("passport");
const { isUserAuthenticated } = require("../middleware/auth");
const router = express.Router();

const successLoginUrl = "http://localhost:3000/login/success";
const errorLoginUrl = "http://localhost:3000/login/error";

//@desc    Auth with google
//@route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ["profile", "email"] }));

//@desc    Google auth callback
//@route   GET /auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureMessage:"Cannot login to google, please try again later!",
        failureRedirect: errorLoginUrl,
        successRedirect: successLoginUrl
    }),
    (req, res) => {
        console.log("user: ", req.user);
        res.send("thank you for signing in");
    }
);

router.get("/test", isUserAuthenticated, (req, res) => {

});

module.exports = router;