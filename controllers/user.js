const express = require("express");
const { model } = require("mongoose");
const User = require("../models/user.js");
module.exports.renderSignupForm = (req,res) => {
    res.render("user/signup.ejs");
}

module.exports.signup = async(req,res)=>{
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
    
}

module.exports.renderLoginForm = (req,res) => {
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","welcom Back to Wondurlust");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}

module.exports.logout = (req,res,next) =>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are succesfully logout");
        res.redirect("/listings")
    });
}