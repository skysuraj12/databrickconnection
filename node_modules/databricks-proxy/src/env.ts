// server/src/env.ts

// Load .env ONLY when running locally.
// In Azure App Service, you should set env vars in "Environment variables".
import dotenv from 'dotenv'

if (!process.env.WEBSITE_INSTANCE_ID) {
  dotenv.config()
}

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing environment variable: ${name}`)
  return v
}

export const ENV = {
  DATABRICKS_HOST: required('DATABRICKS_HOST'),
  DATABRICKS_HTTP_PATH: required('DATABRICKS_HTTP_PATH'),
  DATABRICKS_TOKEN: required('DATABRICKS_TOKEN'),
  PORT: Number(process.env.PORT || 8787),
}
