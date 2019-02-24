var express = require("express");
var router = express.Router();
const { check } = require("express-validator/check");
const authController = require("../controllers/auth");

router
  .get("/", (req, res, next) => {
    res.send("Auth route");
  })
  .post(
    "/register",
    [check("email").isEmail(), check("password").isLength({ min: 6 })],
    authController.createUser
  )
  .post("/login", authController.login);

module.exports = router;
