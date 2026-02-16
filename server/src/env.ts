import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export const ENV = {
  DATABRICKS_HOST: required("DATABRICKS_HOST"),
  DATABRICKS_HTTP_PATH: required("DATABRICKS_HTTP_PATH"),
  DATABRICKS_TOKEN: required("DATABRICKS_TOKEN"),

  // Azure provides PORT; local can default to 8080
  PORT: Number(process.env.PORT) || 8080,
};
