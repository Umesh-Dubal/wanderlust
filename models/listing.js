const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingschema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },

    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"user",
        }
});

listingschema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("listing",listingschema);
module.exports = Listing;
