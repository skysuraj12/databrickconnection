import { DBSQLClient } from "@databricks/sql";
import { ENV } from "./env";

export async function runQuery(sql: string) {
  let client: DBSQLClient | null = null;

  try {
    // Validate environment variables
    if (!ENV.DATABRICKS_HOST) throw new Error("DATABRICKS_HOST not configured");
    if (!ENV.DATABRICKS_HTTP_PATH) throw new Error("DATABRICKS_HTTP_PATH not configured");
    if (!ENV.DATABRICKS_TOKEN) throw new Error("DATABRICKS_TOKEN not configured");

    client = new DBSQLClient();
    await client.connect({
      host: ENV.DATABRICKS_HOST, // ✅ changed
      path: ENV.DATABRICKS_HTTP_PATH,
      token: ENV.DATABRICKS_TOKEN,
    });

    const session = await client.openSession();

    try {
      const op = await session.executeStatement(sql, { runAsync: true });
      const rows = await op.fetchAll();
      await op.close();
      return rows;
    } catch (error: any) {
      throw new Error(`Query execution failed: ${error?.message || error}`);
    } finally {
      try {
        await session.close();
      } catch (error) {
        console.error("Error closing session:", error);
      }
    }
  } catch (error: any) {
    throw new Error(`Databricks connection error: ${error?.message || error}`);
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error("Error closing client:", error);
      }
    }
  }
}
