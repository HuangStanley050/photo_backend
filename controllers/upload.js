const User = require("../models/user");
const mongoose = require("mongoose");

exports.upload = async (req, res, next) => {
  const userId = req.user.id;
  const photoId = req.file.id;
  const photoName = req.file.filename;
  //console.log(userId, photoId, photoName);
  try {
    let user = await User.findById(userId);
    user.photos.push({ photoId, photoName });
    await user.save();
    res.json({ userId, photoName, photoId });
  } catch (err) {
    next(err);
  }
};
