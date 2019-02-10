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
