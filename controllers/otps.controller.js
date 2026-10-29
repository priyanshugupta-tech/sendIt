const { otpModel } = require("../models/otp.model");
const { config } = require("../config/config");
const { sessionModel } = require("../models/session.model");
const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

async function handleOtp(req, res) {
  /**
   * 1. get the OTP along with email
   * 2. Hash it using crypto module
   * 3. query into DB to find the OTP(s)
   * 4. Check and verify the OTP
   * 5. Check weather the user is relevant to the OTP if yes then update isVerified to true
   * 6. Create refresh token and Access token and also create a session
   * 7. verification completed, successfully logged in
   * *
   */

  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({
      messsage: "either of the OTP, userName or email is missing!",
    });
  }

  const hash = crypto.createHash("sha256").update(String(otp)).digest("hex");

  userWithOtp = await otpModel
    .findOne({
      otpHash: hash,
      email: email,
    })
    .then(async (otp) => {
      if (!otp) {
        console.log("invalid otp or expired otp");
        return res.status(401).json({
          message: "invalid or expired otp!",
        });
      }
      if (otp.email === email) {
        await userModel.updateOne(
          { _id: otp.user },
          { $set: { isVerified: true } },
        );
        const refreshToken = jwt.sign({ id: otp.user }, config.secret, {
          expiresIn: "7d",
        });

        sessionModel
          .create({
            user: otp.user,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            refreshToken: crypto
              .createHash("sha256")
              .update(refreshToken)
              .digest("hex"),
            revoked: false,
            deletedAt: null,
          })
          .then((session) => {
            const accessToken = jwt.sign(
              { id: otp.user, sid: session._id },
              config.secret,
              { expiresIn: "15m" },
            );

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              // secure: true,
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
              accessToken: accessToken,
              message: "verification successful!",
            });
          })
          .catch((err) => {
            console.log("some error occured: ", err);
            res.status(500).json({
              message: "some internal server error occured!",
            });
          });
      }
    });
}

exports.handleOtp = handleOtp;
