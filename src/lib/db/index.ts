import { neno, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import * as schema from "./schema";

const isProduction = process.env.Node_ENV === "Production";
const LOCALP_DB_HOST = "db.localtest.me";

let connectionString = process.env.DATABASE_URL;

if(!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}


