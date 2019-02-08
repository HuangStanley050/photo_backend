var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth");

router
  .get("/", (req, res, next) => {
    res.send("Auth route");
  })
  .post("/", authController.createUser);

module.exports = router;
