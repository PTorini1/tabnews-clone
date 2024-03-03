import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  const result = await client.query(queryObject);
  await client.end();

  return result;
}

async function getDatabaseVersion() {
  const version = await query("SELECT version();");
  return version.rows[0].version;
}

async function getActiveConnections() {
  const connections = await query("SELECT COUNT(*) from pg_stat_activity;");
  return connections.rows[0].count;
}

async function getMaxConnections() {
  const max_connections = await query(
    "SELECT * FROM pg_settings WHERE name = 'max_connections'",
  );
  return max_connections.rows[0].setting;
}

export default {
  query: query,
  getDatabaseVersion: getDatabaseVersion,
  getActiveConnections: getActiveConnections,
  getMaxConnections: getMaxConnections,
};
