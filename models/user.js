const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  photos: [
    { photoId: { type: Schema.Types.ObjectId }, photoName: { type: String } }
  ]
});

module.exports = mongoose.model("User", userSchema);
