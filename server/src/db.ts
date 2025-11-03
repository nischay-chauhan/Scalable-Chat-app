import duckdb from "duckdb";
import { randomUUID } from "node:crypto";

const db = new duckdb.Database("chat.db"); 

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id STRING PRIMARY KEY,
  username STRING UNIQUE NOT NULL,
  password STRING NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id STRING PRIMARY KEY,
  name STRING UNIQUE NOT NULL,
  created_by STRING REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_members (
  user_id STRING REFERENCES users(id),
  room_id STRING REFERENCES rooms(id),
  PRIMARY KEY (user_id, room_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id STRING PRIMARY KEY,
  user_id STRING NOT NULL REFERENCES users(id),
  room_id STRING NOT NULL REFERENCES rooms(id),
  text STRING NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
export const generateId = () => randomUUID();
