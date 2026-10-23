const express = require("express");
const { handleSignup } = require("../controllers/signups.controller");
const signupRouter = express.Router();

signupRouter.post("/", handleSignup);

module.exports = {
  signupRouter,
};
