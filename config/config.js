require("dotenv").config();

const missingRequiredEnvVars = [
  "DB_PASSWORD",
  "JWT_SECRET",
  "RESEND_API_KEY",
].filter((key) => !process.env[key]);

if (missingRequiredEnvVars.length > 0) {
  throw new Error(
    `Missing required env vars: ${missingRequiredEnvVars.join(", ")}`,
  );
}

const config = {
  port: Number(process.env.PORT) || 5000,
  db_password: process.env.DB_PASSWORD,
  secret: process.env.JWT_SECRET,
  emailingKey: process.env.RESEND_API_KEY,
  env: process.env.NODE_ENV || "production",
};

exports.config = config;
