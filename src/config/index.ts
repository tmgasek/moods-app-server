import * as dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  PORT: parseInt(process.env.PORT as string, 10),
  NODE_ENV: process.env.NODE_ENV as string,
  SESSION_NAME: process.env.SESSION_NAME as string,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
  SESSION_LIFETIME: parseInt(process.env.SESSION_LIFETIME as string, 10),
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
};

export default config;
