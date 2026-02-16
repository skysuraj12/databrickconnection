import express, { Request, Response } from "express";
import cors from "cors";
import { ENV } from "./env";
import { runQuery } from "./databricks";

process.on("unhandledRejection", (e) => {
  console.error("[UNHANDLED REJECTION]", e);
  process.exit(1);
});
process.on("uncaughtException", (e) => {
  console.error("[UNCAUGHT EXCEPTION]", e);
  process.exit(1);
});

// ✅ Don't print secrets; just show if set
console.log("[BOOT] ENV:", {
  PORT: ENV.PORT,
  HOST: !!ENV.DATABRICKS_HOST,          // ✅ was DATABRICKS_HOSTNAME
  PATH: !!ENV.DATABRICKS_HTTP_PATH,
  TOKEN: !!ENV.DATABRICKS_TOKEN,
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));

app.get("/api/employees", async (_req: Request, res: Response) => {
  try {
    const rows = await runQuery(
      "SELECT * FROM workspace.demo_db.employees LIMIT 100"
    );
    res.json({ rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal Server Error" });
  }
});

app.post("/api/query", async (req: Request, res: Response) => {
  try {
    const { sql } = (req.body || {}) as { sql?: string };
    if (!sql) return res.status(400).json({ error: "Missing sql" });

    console.log("[SQL]", sql);
    const rows = await runQuery(sql);
    res.json({ rows });
  } catch (e: any) {
    console.error("[QUERY ERROR]", e?.message || e);
    res.status(500).json({ error: e?.message || "Internal Server Error" });
  }
});

// ✅ Azure provides PORT; ENV.PORT already defaults safely (8080)
const server = app.listen(ENV.PORT, () => {
  console.log(`API listening on port ${ENV.PORT}`);
});

server.on("error", (err) => {
  console.error("[SERVER LISTEN ERROR]", err);
  process.exit(1);
});
