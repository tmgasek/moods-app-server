import config from ".";

const dbConfig = {
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  namedPlaceholders: true,
};

export default dbConfig;
