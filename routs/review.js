const express = require("express");
const { model } = require("mongoose");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");

const {validatereview,isloggedin,isreviewauther} = require("../midleware.js");

const reviewController = require("../controllers/review.js");

//Review
//post review rout
router.post("/",validatereview ,isloggedin,WrapAsync(reviewController.createReview));

//delete review rout
router.delete("/:reviewId",isloggedin,isreviewauther,WrapAsync(reviewController.deleteReview))

module.exports = router;