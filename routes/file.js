const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwtsecret");

const check_token = (req, res, next) => {
  //console.log(req.query.token);
  const token = req.query.token;
  if (!req.query.token) {
    const error = new Error("No access token present");
    error.statusCode = 401;
    next(error);
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, secret);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    next(error);
  }
  console.log(decodedToken);
  next();
};

router
  .get("/", fileController.get_files)
  .get("/:fileName", fileController.get_file)
  .get("/image/:fileName", check_token, fileController.get_one_image)
  .get(
    "/user/images",
    passport.authenticate("jwt", { session: false }),
    fileController.load_user_images
  );

module.exports = router;
