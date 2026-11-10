const express = require("express");
const { config } = require("./config/config.js");
const dns = require("node:dns");
const cookieParser = require("cookie-parser");
const { logger, initializeLogger } = require("./logger");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    "https://send-it-techyp.vercel.app",
    "https://send-it-orpin-eight.vercel.app",
    "https://sendit-tech.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Routes
const { loginRouter } = require("./routes/loginRoutes");
const { signupRouter } = require("./routes/signupRoutes");
const { otpRouter } = require("./routes/otpRoutes");
const { tokengenRouter } = require("./routes/tokenRoutes");
const { userRouter } = require("./routes/userRoutes");

// Database
const { connectDb } = require("./config/db.js");
const { logoutRouter } = require("./routes/logoutRoutes.js");

app.set("trust proxy", 1);

const dnsServers = "8.8.8.8"
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);
dns.setServers(dnsServers);

// logger
app.use((req, res, next) => {
  logger.info({
    message: "Incoming HTTP Request",
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  });
  next();
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
app.use("/api/auth/getuser", userRouter);

async function startServer() {
  await initializeLogger();
  await connectDb(
    `mongodb+srv://priyanshuguptawebdev_db_user:${config.db_password}@cluster0.udpvgd2.mongodb.net/sendItDb`,
  );
  logger.info("Database connected!");

  app.listen(config.port, "0.0.0.0", () =>
    logger.info(`app started listening on PORT ${config.port}`),
  );
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  logger.close();
  process.exitCode = 1;
});
