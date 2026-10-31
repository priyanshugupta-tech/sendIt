const { randomInt } = require("crypto");
exports.generateOtps = function () {
  return randomInt(100000, 1000000).toString(); //this is the issue and this is the only change that copilot did because...I could notice this and it was taking time and it instantly made the endpoint behave the way it was expected to behave
};
