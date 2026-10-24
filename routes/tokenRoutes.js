const express = require("express");
const tokengenRouter = express.Router();
const { handleTokengen } = require("../controllers/tokengens.controller");

tokengenRouter.post("/", handleTokengen);

exports.tokengenRouter = tokengenRouter;
