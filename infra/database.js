import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  let result = "";
  await client.connect();
  try {
    result = await client.query(queryObject);
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }

  return result;
}

async function getDatabaseVersion() {
  const version = await query("SELECT version();");
  return version.rows[0].version;
}

async function getActiveConnections() {
  const databaseName = process.env.POSTGRES_DB;
  const connections = await query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  return connections.rows[0].count;
}

async function getMaxConnections() {
  const max_connections = await query(
    "SELECT * FROM pg_settings WHERE name = 'max_connections'",
  );
  return parseInt(max_connections.rows[0].setting);
}

export default {
  query: query,
  getDatabaseVersion: getDatabaseVersion,
  getActiveConnections: getActiveConnections,
  getMaxConnections: getMaxConnections,
};
