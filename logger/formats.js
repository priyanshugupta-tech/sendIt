const { format } = require("winston");
const { printf } = format;

const devFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

module.exports = devFormat;
