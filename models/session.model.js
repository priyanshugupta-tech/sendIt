const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user is required!"],
    },
    ip: {
      type: String,
      required: [true, "ip is required"],
    },
    userAgent: {
      type: String,
      required: [true, "userAgent is required!"],
    },
    refreshToken: {
      type: String,
      required: [true, "refresh token is required!"],
      unique: [true, "refresh token should be unique!"],
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

sessionSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 86400, partialFilterExpression: { revoke: true } },
);

exports.sessionModel = mongoose.model("Session", sessionSchema);
