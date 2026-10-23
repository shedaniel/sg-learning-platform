import { createDatabase } from "../src/lib/db";
import { getDb } from "../src/lib/db";

const db = process.env.SG_DB_PATH ? createDatabase(process.env.SG_DB_PATH) : getDb();
const version = db.prepare("PRAGMA user_version").get() as { user_version: number };
console.log(`database ready: user_version=${version.user_version}`);
