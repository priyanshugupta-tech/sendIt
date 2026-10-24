const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { jwt } = require("jsonwebtoken");
const { use } = require("react");

async function handleLogin(req, res) {
  const { userName, password } = req.body();

  if (!userName || !password) {
    return res.status(400).json({
      message: "invalid username or password",
    });
  }

  const user = await userModel.findOne({
    userName: userName,
  });

  if (!user) {
    return res.status(401).json({
      message: "user not found!",
    });
  }

  bcrypt.compare(password, user.password, (err, same) => {
    if (!err) {
      if (same) {
        const refreshToken = jwt.sign(
          { id: user._id, userName: user.userName },
          config.secret,
          { expiresIn: "7d" },
        );
        const accessToken = jwt.sign({ refreshToken }, config.secret, {
          expiresIn: "15m",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken });
      } else {
        return res.status(401).json({ message: "incorrect password!" });
      }
    } else {
      console.log("error occured in comparing the password: ", err);
      return res.status(500).json({ message: "some internal error occured!" });
    }
  });
}

module.exports = {
  handleLogin,
};
