const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file");

router
  .get("/", fileController.get_files)
  .get("/:fileName", fileController.get_file);

module.exports = router;
