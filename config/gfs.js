const mongoose = require("mongoose");
const conn = mongoose.connection;
const Grid = require("gridfs-stream");

let gfs;

module.exports = conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("gridfs ready!!");
});
