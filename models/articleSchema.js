const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  image: {
    publicId: String, //Cloudinary public ID
    url: String, //full image URL
  },
});

module.exports = mongoose.model("Article", articleSchema);
