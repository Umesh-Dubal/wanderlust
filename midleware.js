const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isloggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error","you must be logged in to perform this activity");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) =>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let ermsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,error);
    }else{
      next();
    }
}

module.exports.validatereview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let ermsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,ermsg);
    }else{
      next();
    }
}

module.exports.isreviewauther = async(req,res,next) =>{
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.auther.equals(res.locals.currUser._id)){
        req.flash("error","you are not auther of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}