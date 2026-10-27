const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "username is required!"],
      unique: [true, "username should be unique"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email should be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required!"],
    },
    profilePicture: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 300, partialFilterExpression: { isVerified: false } },
);
const userModel = mongoose.model("User", userSchema);

exports.userModel = userModel;
