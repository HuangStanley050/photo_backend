const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file");

router
  .get("/", fileController.get_files)
  .get("/:fileName", fileController.get_file)
  .get("/image/:fileName", fileController.get_one_image);

module.exports = router;
