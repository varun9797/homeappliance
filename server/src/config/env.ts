import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/appliences",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access-secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};
