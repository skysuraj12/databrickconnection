import express from "express";
import cors from "cors";
import routes from "./routes";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);

// Azure sets PORT
const port = Number(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
