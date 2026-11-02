const winston = require("winston");
const format = require("./formats");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

module.exports = logger;
