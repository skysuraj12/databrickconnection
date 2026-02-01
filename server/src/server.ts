import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
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

console.log("[BOOT] ENV:", {
  PORT: process.env.PORT || ENV.PORT,
  HOST: !!ENV.DATABRICKS_HOSTNAME,
  PATH: !!ENV.DATABRICKS_HTTP_PATH,
  TOKEN: !!ENV.DATABRICKS_TOKEN
});

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- API ROUTES ----------------

app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));

app.get("/api/employees", async (_req: Request, res: Response) => {
  try {
    const rows = await runQuery("SELECT * FROM workspace.demo_db.employees LIMIT 100");
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

// ---------------- FRONTEND (VITE) ----------------
// Serve React build from client/dist so the root URL shows your UI
const clientDist = path.resolve(process.cwd(), "../client/dist");
app.use(express.static(clientDist));

// SPA fallback: any non-API route loads React index.html
app.get("*", (req, res) => {
  // If you want to block unknown API routes, keep APIs under /api only.
  res.sendFile(path.join(clientDist, "index.html"));
});

// ---------------- LISTEN (AZURE PORT FIX) ----------------
const PORT = Number(process.env.PORT || ENV.PORT || 8080);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[BOOT] Listening on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("[SERVER LISTEN ERROR]", err);
  process.exit(1);
});
