const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
      res.json({ message: "User created", userId: createdUser._id });
    }
  } catch (err) {
    throw err;
  }
};
