const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("../models/review")


const ImageSchema = new Schema({
  url : String ,
  filename : String,
})

ImageSchema.virtual("thumbnail").get(function() {
  return this.url.replace('/upload' , '/upload/w_200')
})

const opts = { toJSON : {virtuals : true}};

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry : {
    type : {
      type : String,
      enum : ["Point"],
      required : true,
    },
    coordinates : {
      type : [Number],
      required : true,
    }
  },
  price: Number,
  description: String,
  Location: String,
  author : {
      type : Schema.Types.ObjectId,
      ref : "User"
    },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ]
} , opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function() {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0 , 30 )}...</p>`
})



CampgroundSchema.post("findOneAndDelete" , async (doc) => {
  if (doc) {
    await review.remove({
      _id : {
        $in : doc.reviews
      }
    })
  }
})

module.exports = mongoose.model("Campground", CampgroundSchema);