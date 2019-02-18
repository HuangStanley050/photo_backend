const mongoose = require("mongoose");
const User = require("../models/user");
const Public = require("../models/public");
const Grid = require("gridfs-stream");
const { connection } = require("../config/config");
const conn = mongoose.createConnection(connection);

let gfs;

conn.once("open", () => {
  // Init stream
  //console.log(conn.db);
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

exports.get_files = (req, res, next) => {
  gfs.files.find().toArray((err, files) => {
    if (err) {
      next(err);
    }

    if (!files || files.length === 0) {
      const error = new Error("no files found");
      next(error);
    }
    return res.json(files);
  });
  //res.send("hi");
};

exports.get_file = (req, res, next) => {
  //res.json({ msg: req.params.fileName });
  gfs.files.findOne({ filename: req.params.fileName }, (err, file) => {
    if (err) {
      next(err);
    }
    if (!file || file.length === 0 || file === null) {
      const error = new Error("no such file");
      next(error);
    } else {
      return res.json(file);
    }
  });
};

exports.get_one_image = (req, res, next) => {
  gfs.files.findOne({ filename: req.params.fileName }, (err, file) => {
    if (err) {
      next(err);
    }
    if (!file || file.length === 0 || file === null) {
      const error = new Error("no such file");
      next(error);
    } else {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
};

exports.load_user_images = async (req, res, next) => {
  const userId = req.user.id;
  let photos = [];
  try {
    let user = await User.findById(userId);
    photos = user.photos.slice();
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

exports.make_public = async (req, res, next) => {
  //res.send(req.params.photoId);
  const photoId = req.params.photoId;
  const userId = req.user.id;
  //res.status(200).send(userId);
  try {
    let publicPhoto = await Public.findOne({ userId });
    if (publicPhoto) {
      const error = new Error("Photo is already public");
      throw error;
    } else {
      //if the show case is empty create one
      if (publicPhoto.showCase.length !== 0) {
        const newPublicPhoto = Public({
          userId,
          showCase: [{ photoId }]
        });
        await newPublicPhoto.save();
        res.json({ message: "success" });
      } else {
        publicPhoto.showCase.push({ photoId });
        await publicPhoto.save();
        res.json({ message: "append success" });
      }
    }
  } catch (err) {
    next(err);
  }
};
