const winston = require("winston");
const logger = require("./logger");
const mongodbLogs = require("./mongodbLogs");
const { config } = require("../config/config");
const devFormat = require("./formats");
const { format } = require("winston");
const { combine, timestamp, label } = format;

async function initializeLogger() {
  if (config.env === "production") {
    await mongodbLogs();
  } else if (config.env === "development") {
    logger.add(
      new winston.transports.Console({
        format: combine(
          label({ label: "devLogs" }),
          timestamp({ format: "HH:mm:ss" }),
          devFormat,
        ),
      }),
    );
  } else {
    throw new Error(`Unsupported NODE_ENV: ${config.env}`);
  }
}

module.exports = { logger, initializeLogger };
