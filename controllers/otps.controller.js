const { otpModel } = require("../models/otp.model");
const { config } = require("../config/config");
const { sessionModel } = require("../models/session.model");
const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const logger = require("../logger/logger");

async function handleOtp(req, res) {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({
      message: "OTP or email is missing!",
    });
  }

  try {
    const otpHash = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");
    const otpRecord = await otpModel.findOneAndDelete({
      otpHash,
      email,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (!otpRecord) {
      return res.status(401).json({
        message: "invalid, expired, or already used OTP!",
      });
    }

    const user = await userModel.findOne({
      _id: otpRecord.user,
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found!",
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        message: "account is already verified; please log in with your password.",
      });
    }

    const verifiedUser = await userModel.findOneAndUpdate(
      { _id: user._id, email, isVerified: false },
      { $set: { isVerified: true } },
      { new: true },
    );

    if (!verifiedUser) {
      return res.status(409).json({
        message: "account is already verified; please log in with your password.",
      });
    }

    const refreshToken = jwt.sign({ id: verifiedUser._id }, config.secret, {
      expiresIn: "7d",
    });
    const session = await sessionModel.create({
      user: verifiedUser._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      refreshToken: crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex"),
      revoked: false,
      deletedAt: null,
    });
    const accessToken = jwt.sign(
      { id: verifiedUser._id, sid: session._id },
      config.secret,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: config.env === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    return res.status(201).json({
      accessToken,
      message: "verification successful!",
      user: { userName: verifiedUser.userName, email: verifiedUser.email },
    });
  } catch (error) {
    logger.info("error while verifying OTP: ", error);
    return res.status(500).json({
      message: "some internal server error occured!",
    });
  }
}

exports.handleOtp = handleOtp;
