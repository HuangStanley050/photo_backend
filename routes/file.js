const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file");

router.get("/", fileController.get_files);

module.exports = router;
