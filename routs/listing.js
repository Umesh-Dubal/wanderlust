const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedin,isOwner,validatelisting,} = require("../midleware.js");



//Index Route
router.get("/", WrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new",isloggedin, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", WrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "auther"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you looking for not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/",isloggedin, validatelisting,WrapAsync( async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New Listing created!");
  res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isloggedin, isOwner,WrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you looking for not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id",isloggedin,isOwner,  validatelisting,WrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","Listing updated!");
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isloggedin, isOwner, WrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;