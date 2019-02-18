const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publicSchema = Schema({
  userId: { type: Schema.Types.ObjectId },
  showCase: [
    { photoId: { type: Schema.Types.ObjectId }, photoName: { type: String } }
  ]
});

module.exports = mongoose.model("Public", publicSchema);
