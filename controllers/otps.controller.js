const { otpModel } = require("../models/otp.model");
const { config } = require("../config/config");
const { sessionModel } = require("../models/session.model");
const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function handleOtp(req, res) {
  /**
   * 1. get the OTP along with userName and email
   * 2. Hash it using crypto module
   * 3. query into DB to find the OTP(s)
   * 4. Check and verify the OTP
   * 5. Check weather the user is relevant to the OTP if yes then update isVerified to true
   * 6. Create refresh token and Access token and also create a session
   * 7. verification completed, successfully logged in
   * *
   */

  const { otp, userName, email } = req.body();

  if (!otp || !userName || !email) {
    return res.status(400).json({
      messsage: "either of the OTP, userName or email is missing!",
    });
  }

  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  userWithOtp = await otpModel
    .findOne({
      otp: hash,
      email: email,
    })
    .then(async (otp) => {
      if (otp.userName === userName && otp.email === email) {
        await userModel.updateOne(
          { _id: otp.id },
          { $set: { isVerified: true } },
        );
        const refreshToken = jwt.sign(
          { id: otp.id, userName: otp.userName },
          config.secret,
          {
            expiresIn: "7d",
          },
        );

        const accessToken = jwt.sign(
          { id: otp.id, userName: otp.userName },
          config.secret,
          {
            expiresIn: "15m",
          },

          sessionModel
            .create({
              user: otp.id,
              ip: req.ip,
              userAgent: req.headers["user-agent"],
              refreshToken: refreshToken,
              revoked: false,
              deletedAt: null,
            })
            .then(() => {
              res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: cookieExpiry,
                path: "/api/auth/refresh",
              });
              res.status(204).status({
                accessToken: accessToken,
                message: "verification successful!",
              });
            })
            .catch((err) => {
              console.log("some error occured: ", err);
              res.status(500).json({
                message: "some internal server error occured!",
              });
            }),
        );
      }
    });
}

exports.handleOtp = handleOtp;
