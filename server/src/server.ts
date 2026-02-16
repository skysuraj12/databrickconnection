import { ENV } from "./env";
import { DBSQLClient } from "@databricks/sql";

export async function runQuery(sql: string) {
  const client = new DBSQLClient();

  await client.connect({
    host: ENV.DATABRICKS_HOST,
    path: ENV.DATABRICKS_HTTP_PATH,
    token: ENV.DATABRICKS_TOKEN,
  });

  const session = await client.openSession();
  try {
    const query = await session.executeStatement(sql);

    // Collect all rows
    const result = await query.fetchAll();
    await query.close();

    return result;
  } finally {
    await session.close();
    await client.close();
  }
}
