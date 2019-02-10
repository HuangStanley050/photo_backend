const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file");
const passport = require("passport");

router
  .get("/", fileController.get_files)
  .get("/:fileName", fileController.get_file)
  .get("/image/:fileName", fileController.get_one_image)
  .get(
    "/user/images",
    passport.authenticate("jwt", { session: false }),
    fileController.load_user_images
  );

module.exports = router;
