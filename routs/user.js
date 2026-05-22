const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../midleware.js");

router.get("/signup",(req,res) => {
    res.render("user/signup.ejs");
});

router.post("/signup",WrapAsync(async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newuser = new User({email,username});
        const registeredUser = await User.register(newuser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login",(req,res) => {
    res.render("user/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login' ,failureFlash: true}),async(req,res)=>{
    req.flash("success","welcom Back to Wondurlust");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
});

router.get("/logout",(req,res,next) =>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are succesfully logout");
        res.redirect("/listings")
    });
});

module.exports = router;