const logger = require("./logger");
const winston = require("winston");
const { MongoClient } = require("mongodb");
const { config } = require("../config/config");
require("winston-mongodb");
const { format } = require("winston");
const { combine, timestamp, label, json } = format;

async function mongodbLogs() {
  const url = `mongodb+srv://priyanshuguptawebdev_db_user:${config.db_password}@cluster0.udpvgd2.mongodb.net/sendItLogs`;
  const client = new MongoClient(url);
  await client.connect();

  const transport = new winston.transports.MongoDB({
    db: client,
    collection: "logs",
    format: combine(
      label({ label: "productionLog" }),
      timestamp({ format: "HH:mm:ss" }),
      json(),
    ),
  });
  transport.on("error", (error) => {
    console.error("MongoDB log transport error:", error);
  });
  logger.add(transport);

  await new Promise((resolve, reject) => {
    transport.once("logged", resolve);
    transport.once("error", reject);
    logger.info("MongoDB logger initialized");
  });
}

module.exports = mongodbLogs;
