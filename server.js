const express = require("express");
require("dotenv").config();
const dns = require("node:dns");
const { loginRouter } = require("./routes/loginRoutes");
const { signupRouter } = require("./routes/signupRoutes");
const { connectDb } = require("./db.js");
const app = express();

const dnsServers = "8.8.8.8"
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);
dns.setServers(dnsServers);

const db_password = encodeURIComponent(process.env.DB_PASSWORD);
connectDb(
  `mongodb+srv://priyanshuguptawebdev_db_user:${db_password}@cluster0.udpvgd2.mongodb.net/`,
)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Error Occured: ", err));

app.use("/login", loginRouter);
app.use("/signup", signupRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`app started listening on PORT ${PORT}`));
