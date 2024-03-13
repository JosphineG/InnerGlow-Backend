const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
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
  imageUrls: [
    {
      type: String, // Store the URLs of the images uploaded to Cloudinary
      required: true,
    },
  ],
});

module.exports = mongoose.model("Story", storySchema);
