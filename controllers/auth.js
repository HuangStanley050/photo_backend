const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/jwtsecret");

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });

    if (user) {
      throw new Error("User already exists!!");
    } else {
      let hashedpassword = await bcrypt.hash(password, 12);
      //res.json({ name, hashedpassword, email });
      const newUser = User({
        name,
        email,
        password: hashedpassword
      });
      let createdUser = await newUser.save();
      res.json({ message: "User created", userId: createdUser.id });
    }
  } catch (err) {
    throw err;
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //console.log(email, password);
  try {
    let user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 401;
      throw error;
    }

    let isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    } else {
      const payload = {
        id: user.id,
        name: user.name
      };

      const token = jwt.sign(payload, secret.secret, { expiresIn: "1h" });
      res.json({ token: token, userName: user.name });
    }
  } catch (err) {
    next(err);
  }
};
