const express = require("express");
const { config } = require("./config/config.js");
const dns = require("node:dns");
const cookieParser = require("cookie-parser");
const fs = require("fs");

// Routes
const { loginRouter } = require("./routes/loginRoutes");
const { signupRouter } = require("./routes/signupRoutes");
const { otpRouter } = require("./routes/otpRoutes");
const { tokengenRouter } = require("./routes/tokenRoutes");

// Database
const { connectDb } = require("./config/db.js");
const { logoutRouter } = require("./routes/logoutRoutes.js");

const app = express();

const dnsServers = "8.8.8.8"
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);
dns.setServers(dnsServers);

connectDb(
  `mongodb+srv://priyanshuguptawebdev_db_user:${config.db_password}@cluster0.udpvgd2.mongodb.net/sendItDb`,
)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Error Occured: ", err));

// logger
app.use("/", (req, res, next) => {
  const log = `userIP: ${req.ip} user-agent: ${req.headers["user-agent"]} request-timing: ${Date.now()}`;
  fs.appendFile("logs.txt", `${log}\n`, "utf-8", (error) => {
    if (error) {
      return next(error);
    }
    console.log(log);
    next();
  });
});

// plugins
app.use(express.json());
app.use(cookieParser());

// auth routes
app.use("/api/auth/login", loginRouter);
app.use("/api/auth/signup", signupRouter);
app.use("/api/auth/verify-otp", otpRouter);
app.use("/api/auth/newtoken", tokengenRouter);
app.use("/api/auth/logout", logoutRouter);

app.listen(config.port, () =>
  console.log(`app started listening on PORT ${config.port}`),
);
