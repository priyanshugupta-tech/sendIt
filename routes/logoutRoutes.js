const express = require("express");
const logoutRouter = express.Router();
const {
  logoutHandler,
  logoutAllHandler,
} = require("../controllers/logouts.controller");

logoutRouter.post("/", logoutHandler);
logoutRouter.post("/logoutall", logoutAllHandler);

exports.logoutRouter = logoutRouter;
