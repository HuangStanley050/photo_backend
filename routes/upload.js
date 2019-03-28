const express = require("express");
const router = express.Router();
const upLoadController = require("../controllers/upload");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const config = require("../config/config");
const passport = require("passport");

const storage = new GridFsStorage({
  url: config.connection,
  file: (req, file) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "photos",
        filename: file.originalname
      };
    } else {
      return null;
    }
  }
});

const upload = multer({ storage });

/* upload route. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  upLoadController.upload
);
//   .get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
//     res.json({ msg: "you passed" });
//   });

module.exports = router;
