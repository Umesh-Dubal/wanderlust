const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedin,isOwner,validatelisting,} = require("../midleware.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "auther"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you looking for not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing= async (req, res) => {
  let url = req.file.path
  let filename = req.file.filename
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success","New Listing created!");
  res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you looking for not exist!");
    return res.redirect("/listings");
  }
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing,originalimageurl });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined"){
    let url = req.file.path
    let filename = req.file.filename
    listing.image = {url,filename};
    await listing.save();
  }
  
  req.flash("success","Listing updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}