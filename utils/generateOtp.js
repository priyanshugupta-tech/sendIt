const { randomInt } = require("crypto");
exports.generateOtps = function () {
  return randomInt(1000000, 10000000, (err, n) => {
    if (err) throw err;
    else return n;
  });
};
