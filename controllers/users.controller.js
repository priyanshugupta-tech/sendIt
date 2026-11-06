const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const logger = require("../logger/logger");

async function handleUser(req, res) {
  try {
    const accessToken = req.body.accessToken;

    if (!accessToken) {
      return res.status(400).json({ message: "accessToken is missing!" });
    }

    const decoded = jwt.verify(accessToken, config.secret);

    const user = await userModel.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    return res
      .status(200)
      .json({
        message: "user found!",
        user: { userName: user.userName, email: user.email },
      });
  } catch (error) {
    logger.info("Some error occured: ", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "access token invalid or expired, please login again!",
      });
    }
    return res.status(500).json({
      message: "Some internal server error occured!",
    });
  }
}

module.exports = {
  handleUser,
};
