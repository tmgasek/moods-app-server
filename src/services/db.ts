import mysql from "mysql2/promise";
import dbConfig from "../config/db";

async function query(sql: string, params: any) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(sql, params);

  return results;
}

const db = {
  query,
};

export default db;
