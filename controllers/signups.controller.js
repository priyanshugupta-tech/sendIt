const { config } = require("../config/config");
const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");

async function handleSignup(req, res) {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(422).json({
        message: "either of the detail is missing or invalidly entered!",
      });
    }
    if (password.length < 8) {
      return res.status(422).json({
        message: "lenght of password is less than 8",
      });
    }

    try {
      const IsAlreadyRegistered = await userModel.findOne({
        $or: [{ userName }, { email }],
      });

      if (IsAlreadyRegistered) {
        return res.status(409).json({
          message: "This username or email already exists",
        });
      }

      bcrypt.hash(password, 10, function (err, hash) {
        if (!err) {
          // create user with "verified: false"
          // Send OPT to user's email to verify
        } else {
          console.log("error occured in hashing the password: ", err);
          return res
            .status(500)
            .json({ message: "some internal error occured!" });
        }
      });
    } catch (err) {
      console.log("some error occured: ", err);
      return res.status(500).json({
        message: "internal server error",
      });
    }
  } catch (error) {
    console.log("some error occured: ", err);
    return res.status(400).json({
      message: "one or more fields are missing!",
    });
  }
}

module.exports = {
  handleSignup,
};
