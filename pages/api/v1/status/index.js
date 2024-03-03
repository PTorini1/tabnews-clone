import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        postgres_version: await database.getDatabaseVersion(),
        max_connections: await database.getMaxConnections(),
        active_connections: await database.getActiveConnections(),
      },
    },
  });
}

export default status;
