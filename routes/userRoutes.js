const express = require("express");
const { handleUser } = require("../controllers/users.controller");

const userRouter = express.Router();

userRouter.post("/", handleUser);

module.exports = {
  userRouter,
};
