const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { emailer } = require("../services/email.service");
const { generateOtps } = require("../utils/generateOtp");
const { otpModel } = require("../models/otp.model");

async function handleSignup(req, res) {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(422).json({
        message: "either of the detail is missing or invalidly entered!",
      });
    }
    if (password.length < 8) {
      return res.status(422).json({
        message: "lenght of password is less than 8",
      });
    }

    try {
      const IsAlreadyRegistered = await userModel.findOne({
        $and: [{ userName }, { email }],
      });

      if (IsAlreadyRegistered) {
        if (!IsAlreadyRegistered.isVerified) {
          /**
           * create OTP save it to the DB send OTP
           * *
           */
          const otp = generateOtps();
          otpModel
            .create({
              id: IsAlreadyRegistered._id,
              email: IsAlreadyRegistered.email,
              user: IsAlreadyRegistered._id,
              otpHash: crypto.createHash("sha256").update(otp).digest("hex"),
            })
            .then((otpSent) => {
              emailer(email, otp)
                .then(async ({ data, err }) => {
                  if (err) {
                    console.log("some error occured at resend's end: ", err);
                    await userModel.findByIdAndDelete(user._id);
                    await otpModel.findByIdAndDelete(otpSent._id);
                    return res.status(502).json({
                      message: "third-party service failure!",
                    });
                  } else {
                    res.json(201).json({
                      message: "signup successful!",
                    });
                  }
                })
                .catch(async (err) => {
                  console.log("error occured in sending the email: ", err);
                  await userModel.findByIdAndDelete(user._id);
                  await otpModel.findByIdAndDelete(otpSent._id);
                  return res.status(500).json({
                    message: "internal server error",
                  });
                });
            });
        } else {
          return res.status(409).json({
            message: "user already exist!",
          });
        }
      }

      const somethingExists = await userModel.findOne({
        $or: [{ userName }, { email }],
      });

      if (somethingExists) {
        return res.json(409).status({
          message: "some user with same userName or email already exists!",
        });
      }

      bcrypt.hash(password, 10, async function (err, hash) {
        if (!err) {
          /**
           *Create User with verified: false*
           */
          userModel
            .create({
              email: email,
              userName: userName,
              password: hash,
              isVerified: false,
            })
            .then((user) => {
              const otp = generateOtps();
              otpModel
                .create({
                  id: IsAlreadyRegistered._id,
                  email: user.email,
                  user: user._id,
                  otpHash: crypto
                    .createHash("sha256")
                    .update(otp)
                    .digest("hex"),
                })
                .then((otpSent) => {
                  emailer(email, otp)
                    .then(async ({ data, err }) => {
                      if (err) {
                        console.log(
                          "some error occured at resend's end: ",
                          err,
                        );
                        await userModel.findByIdAndDelete(user._id);
                        await otpModel.findByIdAndDelete(otpSent._id);
                        return res.status(502).json({
                          message: "third-party service failure!",
                        });
                      } else {
                        res.json(201).json({
                          message: "signup successful!",
                        });
                      }
                    })
                    .catch(async (err) => {
                      console.log("error occured in sending the email: ", err);
                      await userModel.findByIdAndDelete(user._id);
                      await otpModel.findByIdAndDelete(otpSent._id);
                      return res.status(500).json({
                        message: "internal server error",
                      });
                    });
                })
                .catch((err) => {
                  console.log("some error occured: ", err);
                  return res
                    .status(500)
                    .json({ message: "internal server error!" });
                });
            })
            .catch(() => {
              console.log("Error in creating user: ", err);
              res.status(500).json({
                message: "internal server error occured!",
              });
            });
        } else {
          console.log("error occured in hashing the password: ", err);
          return res
            .status(500)
            .json({ message: "some internal error occured!" });
        }
      });
    } catch (err) {
      console.log("some error occured: ", err);
      return res.status(500).json({
        message: "internal server error",
      });
    }
  } catch (error) {
    console.log("some error occured: ", err);
    return res.status(400).json({
      message: "one or more fields are missing!",
    });
  }
}

module.exports = {
  handleSignup,
};
