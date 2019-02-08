var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth");

router
  .get("/", (req, res, next) => {
    res.send("Auth route");
  })
  .post("/register", authController.createUser)
  .post("/login", authController.login);

module.exports = router;
