const express = require("express");
const { config } = require("./config/config.js");
const dns = require("node:dns");
const cookieParser = require("cookie-parser");

// Routes
const { loginRouter } = require("./routes/loginRoutes");
const { signupRouter } = require("./routes/signupRoutes");
const { otpRouter } = require("./routes/otpRoutes");
const { tokengenRouter } = require("./routes/tokenRoutes");

// Database
const { connectDb } = require("./config/db.js");

const app = express();

const dnsServers = "8.8.8.8"
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);
dns.setServers(dnsServers);

connectDb(
  `mongodb+srv://priyanshuguptawebdev_db_user:${config.db_password}@cluster0.udpvgd2.mongodb.net/`,
)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Error Occured: ", err));

app.use(express.json());
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/verify-otp", otpRouter);
app.use("/newtoken", tokengenRouter);
app.use(cookieParser());

app.listen(config.port, () =>
  console.log(`app started listening on PORT ${config.port}`),
);
