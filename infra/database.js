import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
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

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
  getDatabaseVersion,
  getActiveConnections,
  getMaxConnections,
};
