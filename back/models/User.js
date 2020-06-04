const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  login: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 100,
  },
  followers: [],
  following: [],
  activities: [{
    type: mongoose.Types.ObjectId,
    ref: "Activity",
    required: true,
  }],
});

module.exports = mongoose.model("User", userSchema);
