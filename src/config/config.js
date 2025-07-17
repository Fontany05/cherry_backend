import dotenv from "dotenv";
dotenv.config();

export default {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 8080,
  dbUri: process.env.MONGO_DB_URI || "",
  secret: process.env.JWT_SECRET || "TEST",
  refreshSecret: process.env.REFRESH_SECRET || "TEST",
};
