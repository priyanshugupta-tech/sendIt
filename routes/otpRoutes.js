const express = require("express");
const otpRouter = express.Router();
const { handleOtp } = require("../controllers/otps.controller");

otpRouter.post("/", handleOtp);

exports.otpRouter = otpRouter;
