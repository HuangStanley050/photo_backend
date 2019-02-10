const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const Grid = require("gridfs-stream");

const upLoadRoute = require("./routes/upload");
const authRouter = require("./routes/auth");
const fileRouter = require("./routes/file");

const config = require("./config/config");
// const conn = mongoose.connection;

mongoose
  .connect(config.connection, { useNewUrlParser: true })
  .then(() => console.log("connected to Atlas"))
  .catch(err => console.log(err));

const app = express();

// let gfs;

// conn.once("open", () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("uploads");
//   console.log("gridfs ready!!");
// });

//require("./config/gfs");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport")(passport);

app.use(cors());

app.use("/api/upload", upLoadRoute);
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});

module.exports = app;
