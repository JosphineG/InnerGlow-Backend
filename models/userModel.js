const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password") || this.isNew) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
});

exports.userModel = mongoose.model("User", userSchema);
