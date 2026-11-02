const { format } = require("winston");
const { combine, timestamp, label, printf } = format;

const devFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

module.exports = devFormat;
