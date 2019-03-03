const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = Schema({
  photoId: { type: Schema.Types.ObjectId },
  ratings: [
    {
      reviewerId: { type: Schema.Types.ObjectId },
      reviewerName: String,
      ratings: Number
    }
  ]
});

module.exports = mongoose.model("Rating", ratingSchema);
