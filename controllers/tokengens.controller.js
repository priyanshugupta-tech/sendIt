const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const { userModel } = require("../models/user.model");

exports.handleTokengen = async function handleTokengen(req, res) {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refreshToken not found!",
    });
  }

  const decoded = jwt.verify(refreshToken, config.secret);

  const user = await userModel.findById(decoded.id);

  const accessToken = jwt.sign(
    {
      id: user._id,
      userName: user.userName,
    },
    config.secret,
    {
      expiresIn: "15m",
    },
  );

  refreshToken = jwt.sign(
    {
      id: user._id,
      userName: user.userName,
    },
    config.secret,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    message: "tokens sucessfully restored!",
    accessToken: accessToken,
  });
};
