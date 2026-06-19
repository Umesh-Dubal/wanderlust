const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const {isloggedin,isOwner,validatelisting,} = require("../midleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConflict.js")
const upload = multer({ storage})

router
  .route("/")
  .get( WrapAsync(listingController.index)) //Index Route
  .post(isloggedin, upload.single('listing[image]'),validatelisting,WrapAsync( listingController.createListing));//Create Route
  

//New Route
router.get("/new",isloggedin,listingController.renderNewForm);

router
  .route("/:id",)
  .get( WrapAsync(listingController.showListing)) //Show Route
  .put(isloggedin,isOwner, validatelisting,upload.single('listing[image]'), WrapAsync(listingController.updateListing)) //Update Route
  .delete(isloggedin, isOwner, WrapAsync(listingController.deleteListing));  //Delete Route


//Edit Route
router.get("/:id/edit", isloggedin, isOwner,WrapAsync(listingController.editListing));

module.exports = router;