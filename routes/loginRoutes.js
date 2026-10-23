const express = require("express");
const loginRouter = express.Router();
const { handleLogin } = require("../controllers/logins.contoller");

loginRouter.post("/", handleLogin);

module.exports = { loginRouter };
