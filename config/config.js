require("dotenv").config();

if (
  !process.env.DB_PASSWORD ||
  !process.env.JWT_SECRET ||
  !process.env.PORT ||
  !process.env.RESEND_API_KEY ||
  !process.env.NODE_ENV
) {
  throw new Error("env_var does not exist in .env file");
}

const config = {
  port: process.env.PORT,
  db_password: process.env.DB_PASSWORD,
  secret: process.env.JWT_SECRET,
  emailingKey: process.env.RESEND_API_KEY,
  env: process.env.NODE_ENV,
};

exports.config = config;
