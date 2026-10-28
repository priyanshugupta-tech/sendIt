const { sessionModel } = require("../models/session.model");
const crypto = require("crypto");
const { jwt } = require("jsonwebtoken");
const { config } = require("../config/config");

exports.logoutHandler = async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "invalid refresh token!",
      });
    }

    await sessionModel
      .findOne({
        refreshToken: crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex"),
      })
      .then((session) => {
        if (session || session.revoked === false) {
          session = {
            ...session,
            revoke: true,
            deletedAt: math.floor(Date.now() / 1000),
          };
          session
            .save()
            .then(() => {
              res.clearCookie({
                httpOnly: true,
                secure: true,
                sameSite: "strict",
              });

              return res.status(204).end();
            })
            .catch((err) => {
              console.log("error revoking the seesion: ", err);
              return res.status(500).json({
                message: "internal server error!",
              });
            });
        }
      })
      .catch((err) => {
        console.log("error occured in database querying: ", err);
        return res.status(500).json({
          message: "internal server error!",
        });
      });
  } catch (err) {
    console.log("some error occured: ", err);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "token expired, please login again!",
      });
    }
    return res.status(401).json({
      message: "you are not authenticated to logout!",
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

    if (!decoded.revoke) {
      return res.status(401).json({
        message: "you are not authenticated to logout!",
      });
    }

    await sessionModel
      .updateMany(
        { _id: decoded.id, revoke: false },
        { $set: { revoke: true, deletedAt: Math.floor(Date.now() / 1000) } },
      )
      .then(() => {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        return res.status(204).end();
      })
      .catch((err) => {
        console.log("error occured in database querying and updating: ", err);
        return res.status(500).json({
          message: "internal server error!",
        });
      });
  } catch (err) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "token expired, please login again!",
      });
    }
    console.log("some error occured: ", err);
    return res.status(401).json({
      message: "you are not authenticated to logout!",
    });
  }
};
