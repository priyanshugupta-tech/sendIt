const { userModel } = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { jwt } = require("jsonwebtoken");
const { sessionModel } = require("../models/session.model");
const { ref } = require("process");

async function handleLogin(req, res) {
  const { userName, password } = req.body();

  try {
    if (!userName || !password) {
      return res.status(400).json({
        message: "invalid username or password",
      });
    }

    try {
      const user = await userModel.findOne({
        userName: userName,
      });

      if (!user) {
        return res.status(401).json({
          message: "user not found!",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          message: "user is not verified!",
        });
      }

      bcrypt.compare(password, user.password, async (err, same) => {
        if (!err) {
          if (same) {
            const refreshToken = jwt.sign(
              { id: user._id, userName: user.userName },
              config.secret,
              { expiresIn: "7d" },
            );
            const accessToken = jwt.sign(
              { id: user._id, userName: user.userName },
              config.secret,
              {
                expiresIn: "15m",
              },
            );

            const hashedRefreshToken = crypto
              .createHash("sha256")
              .update(refreshToken)
              .digest("hex");

            await sessionModel.create({
              user: user._id,
              ip: req.ip,
              refreshToken: hashedRefreshToken,
              userAgent: req.headers["user-agent"],
              revoked: false,
              deletedAt: null,
            });

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: cookieExpiry,
              path: "/api/auth/newtoken",
            });

            return res.status(200).json({ accessToken });
          } else {
            return res.status(401).json({ message: "incorrect password!" });
          }
        } else {
          console.log("error occured in comparing the password: ", err);
          return res
            .status(500)
            .json({ message: "some internal error occured!" });
        }
      });
    } catch (error) {
      console.log("some error occured: ", err);
      return res.status(500).json({
        message: "internal server error!",
      });
    }
  } catch (error) {
    console.log("some error occured: ", err);
    return res.status(400).json({
      message: "either of the userName or password is missing!",
    });
  }
}

module.exports = {
  handleLogin,
};
