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
    filename: {
        type: String,
        default: "listingimage",
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop"
                : v,
    }
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
