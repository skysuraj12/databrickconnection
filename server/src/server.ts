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

console.log("[BOO]()
