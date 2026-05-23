const express = require("express");
const { model } = require("mongoose");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereview,isloggedin,isreviewauther} = require("../midleware.js");



//Review
//post review rout
router.post("/",validatereview ,isloggedin,WrapAsync(async(req ,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.auther = req.user._id;
    listing.reviews.push(newreview);
    
    await newreview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review rout
router.delete("/:reviewId",isloggedin,isreviewauther,WrapAsync(async(req,res) => {
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash("success","review Deleted!");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;