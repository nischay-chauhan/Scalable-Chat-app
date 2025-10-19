import duckdb from "duckdb";
import { randomUUID } from "node:crypto";

const db = new duckdb.Database("chat.db"); 

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id STRING PRIMARY KEY,
  username STRING UNIQUE NOT NULL,
  room STRING NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id STRING PRIMARY KEY,
  name STRING UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id STRING PRIMARY KEY,
  user_id STRING NOT NULL,
  room STRING NOT NULL,
  text STRING NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
export const generateId = () => randomUUID();
