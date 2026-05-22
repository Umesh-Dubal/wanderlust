const express = require("express");
const { model } = require("mongoose");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validatereview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let ermsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,ermsg);
    }else{
      next();
    }
}

//Review
//post review rout
router.post("/",validatereview ,WrapAsync(async(req ,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review rout
router.delete("/:reviewId",WrapAsync(async(req,res) => {
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash("success","review Deleted!");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;