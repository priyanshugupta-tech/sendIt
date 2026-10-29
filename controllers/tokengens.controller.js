const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const { userModel } = require("../models/user.model");
const crypto = require("crypto");
const { sessionModel } = require("../models/session.model");

exports.handleTokengen = async function handleTokengen(req, res) {
  try {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "refreshToken not found!",
      });
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.findOne({
      refreshToken: hashedRefreshToken,
    });
    if (!session || session.revoked) {
      return res.status(403).json({
        message: "refreshToken is invalid or revoked!",
      });
    }

    const decoded = jwt.verify(refreshToken, config.secret);

    const user = await userModel.findById(decoded.id);

    const newRefreshToken = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
      },
      config.secret,
      {
        expiresIn: "7d",
      },
    );

    session.refreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await session.save();

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        sid: session._id,
      },
      config.secret,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/newtoken",
    });

    return res.status(201).json({
      message: "tokens sucessfully restored!",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("some error occured: ", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "token expired, please login again!",
      });
    }
    return res.status(401).json({
      message: "you are not authenticated!",
    });
  }
};
