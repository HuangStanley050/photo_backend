const mongoose = require("mongoose");
const User = require("../models/user");
const Public = require("../models/public");
const Rating = require("../models/rating");
const Grid = require("gridfs-stream");
const { connection } = require("../config/config");
const conn = mongoose.createConnection(connection, { useNewUrlParser: true });

let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

//console.log(gfs);

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
  // gfs.files.findOne({ filename: req.params.fileName }, (err, file) => {
  //   if (err) {
  //     next(err);
  //   }
  //   if (!file || file.length === 0 || file === null) {
  //     const error = new Error("no such file");
  //     next(error);
  //   } else {
  //     const readstream = gfs.createReadStream(file.filename);
  //     readstream.pipe(res);
  //   }
  // });
  //=========================Changing to get the image via photoId====================//

  const photoId = mongoose.Types.ObjectId(req.params.photoId);
  //console.log(req.params.photoId);
  gfs.files.findOne({ _id: photoId }, (err, file) => {
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
  let publicPhotos = [];
  //need to load all the public photos user has and send to front end
  try {
    let user = await User.findById(userId);
    photos = user.photos.slice();
    let publicphoto = await Public.findOne({ userId });
    publicPhotos = publicphoto.showCase.slice();
    res.json({ photos, publicPhotos });
  } catch (err) {
    next(err);
  }
};

exports.make_public = async (req, res, next) => {
  const photoId = req.query.photoId;
  const photoName = req.query.photoName;
  const userId = req.user.id;

  try {
    let publicPhoto = await Public.findOne({ userId });
    if (!publicPhoto) {
      const newPublicPhoto = Public({
        userId,
        showCase: [{ photoId, photoName }]
      });
      await newPublicPhoto.save();
      return res.json({ message: "created!" });
    }
    if (
      publicPhoto.showCase.find(photo => photo.photoId.toString() === photoId)
    ) {
      const error = new Error("The photo is already in public collection");
      error.data = photoId;
      throw error;
    }
    publicPhoto.showCase.push({ photoId, photoName });
    let result = await publicPhoto.save();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.unmake_public = async (req, res, next) => {
  const photoId = req.query.photoId;
  const userId = req.user.id;
  let temp_list = [];
  try {
    let publicPhoto = await Public.findOne({ userId });
    //check if the user have a public collection created
    if (!publicPhoto) {
      const error = new Error("You have no public photos available");

      throw error;
    }
    //check if the photoId is in the public collection document
    //=========== using toString() to convert mongodb objectId so can compare with the query string
    if (
      !publicPhoto.showCase.find(photo => photo.photoId.toString() === photoId)
    ) {
      const error = new Error("the photo is not in the public view");
      error.data = photoId;
      throw error;
    }

    temp_list = publicPhoto.showCase.slice();
    //=========== using toString() to convert mongodb objectId so can compare with the query string
    let newlist = temp_list.filter(
      photo => photo.photoId.toString() !== photoId
    );
    publicPhoto.showCase = newlist.slice();
    await publicPhoto.save();
    res.json(newlist);
  } catch (err) {
    next(err);
  }
};

exports.get_showcase = async (req, res, next) => {
  let publicImages = [];
  let result = [];
  let ratedPhotos = [];
  let ratedPhotos_result = [];
  try {
    publicImages = await Public.find({});
    ratedPhotos = await Rating.find({});
    //console.log(publicImages);
    publicImages.forEach(publicimage => {
      for (let i of publicimage.showCase) {
        result.push(i);
      }
    });

    ratedPhotos.forEach(ratePhoto => {
      ratedPhotos_result.push({
        id: ratePhoto.photoId,
        reviewers: ratePhoto.ratings
      });
    });

    //console.log(ratedPhotos_result);
    res.json({ result: result, photosRated: ratedPhotos_result });
  } catch (err) {
    next(err);
  }
};

exports.ratePhoto = async (req, res, next) => {
  //res.json({ id: req.params.photoId, data: req.body });
  const { reviewerId, photoId, ratings, reviewerName } = req.body;
  //console.log(reviewerId, photoId, ratings);
  let ratedPhotos_result = [];

  try {
    let ratePhoto = await Rating.findOne({ photoId });
    if (!ratePhoto) {
      const newRatePhoto = Rating({
        photoId: photoId,
        ratings: [{ reviewerId, reviewerName, ratings }]
      });
      let newPhoto = await newRatePhoto.save();
      //let transformPhoto = { id: newPhoto.id, reviewers: newPhoto.ratings };
      let ratedPhotos = await Rating.find({});
      ratedPhotos.forEach(ratePhoto => {
        ratedPhotos_result.push({
          id: ratePhoto.photoId,
          reviewers: ratePhoto.ratings
        });
      });
      return res.json(ratedPhotos_result);
    }

    //=======find out if the person has already reviewed the photo
    let reviewer = ratePhoto.ratings.find(reviewer => {
      return reviewer.reviewerId.toString() === reviewerId;
    });

    if (reviewer) {
      const error = new Error();
      error.message = "You have already reviewed the photo";
      error.data = photoId;
      //console.log(error);
      throw error;
    }
    //================end test=========================//

    ratePhoto.ratings.push({ reviewerId, reviewerName, ratings });
    await ratePhoto.save();

    let ratedPhotos = await Rating.find({});

    ratedPhotos.forEach(ratePhoto => {
      ratedPhotos_result.push({
        id: ratePhoto.photoId,
        reviewers: ratePhoto.ratings
      });
    });

    res.json(ratedPhotos_result);
  } catch (err) {
    next(err);
  }
  //res.json({ msg: "success" });
};
