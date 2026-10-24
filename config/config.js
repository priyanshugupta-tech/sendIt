require(dotenv).config();

if (!process.env.DB_PASSWORD || !process.env.JWT_SECRET || process.env.PORT) {
  throw new Error({ message: "env_var does not exist in .env file" });
}

const config = {
  port: process.env.PORT,
  db_password: process.env.DB_PASSWORD,
  secret: process.env.JWT_SECRET,
};

exports.config = config;
