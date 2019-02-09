const User = require("../models/user");

exports.upload = async (req, res, next) => {
  const userId = req.user.id;
  const photoId = req.file.id;
  console.log(userId, photoId);
  try {
    let user = await User.findById(userId);
    user.photos.push(photoId);
    await user.save();
  } catch (err) {
    next(err);
  }
  res.json({ userId, photoId });
};
