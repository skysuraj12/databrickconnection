import express from "express";
import cors from "cors";
import routes from "./routes";
import "dotenv/config";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// API routes first
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);

// Serve React build (GitHub Action copies client/dist -> server/public)
const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

// SPA fallback (React Router)
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`API listening on port ${port}`));
