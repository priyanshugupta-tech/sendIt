const { mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "user is required!"],
  },
  otpHash: {
    type: String,
    required: [true, "otp is required!"],
  },
});

exports.otpModel = mongoose.model("Otp", otpSchema);
