const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../midleware.js");

const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.signup));


router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login' ,failureFlash: true}),userController.login);

    
router.get("/logout",userController.logout);

module.exports = router;