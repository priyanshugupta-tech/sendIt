const express = require("express");
const tokengenRouter = express.Router();
const { handleTokengen } = require("../controllers/tokengens.controller");

tokengenRouter.get("/", handleTokengen);

exports.tokengenRouter = tokengenRouter;
