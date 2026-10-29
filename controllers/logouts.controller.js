const { sessionModel } = require("../models/session.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

exports.logoutHandler = async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "invalid refresh token!",
      });
    }

    const session = await sessionModel.findOne({
      refreshToken: crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex"),
    });

    if (!session || session.revoked) {
      return res.status(401).json({
        message: "invalid or revoked refresh token!",
      });
    }

    session.revoked = true;
    session.deletedAt = new Date();
    await session.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(204).end();
  } catch (err) {
    console.log("error revoking the session: ", err);
    return res.status(500).json({
      message: "internal server error!",
    });
  }
};

exports.logoutAllHandler = async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "invalid refresh token!",
      });
    }

    const decoded = jwt.verify(refreshToken, config.secret);
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await sessionModel.findOne({
      user: decoded.id,
      refreshToken: hashedRefreshToken,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        message: "you are not authenticated to logout!",
      });
    }

    await sessionModel.updateMany(
      { user: decoded.id, revoked: false },
      { $set: { revoked: true, deletedAt: new Date() } },
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return res.status(204).end();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "token expired, please login again!",
      });
    }
    console.log("some error occured: ", error);
    return res.status(401).json({
      message: "you are not authenticated to logout!",
    });
  }
};
