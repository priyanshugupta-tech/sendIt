const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
const { config } = require("../config/config");

// Initialize Logtail with the Source Token from environment variables
const logtail = new Logtail(config.sourceToken);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(), // Keeps data structured for search and filtering
  ),
  transports: [
    // 1. Log to the regular console (so you can still see it in Render dashboard)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // 2. Stream logs to Better Stack for persistent storage and Live Tail
    new LogtailTransport(logtail),
  ],
});

module.exports = logger;
