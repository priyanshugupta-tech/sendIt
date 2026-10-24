const { config } = require("../config/config");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");

async function handleSignup(req, res) {
  const { userName, email, password } = req.body;

  const IsAlreadyRegistered = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (IsAlreadyRegistered) {
    res.status(409).json({
      message: "This username or email already exists",
    });
  }

  bcrypt.hash(password, 10, function (err, hash) {
    if (!err) {
      userModel
        .create({ email: email, password: hash, userName: userName })
        .then((data) => {
          const token = jwt.sign({ id: data._id }, config.secret, {
            expiresIn: "1d",
          });

          res.status(201).json({
            message: "user registered sucessfully!",
            userData: data,
            token: token,
          });
        })
        .catch((err) => console.log("error in registration: ", err));
    } else {
      console.log("error occured in hashing the password: ", err);
    }
  });
}

module.exports = {
  handleSignup,
};
