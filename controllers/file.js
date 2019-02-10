const mongoose = require("mongoose");

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
