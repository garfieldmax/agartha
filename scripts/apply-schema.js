#!/usr/bin/env node

/**
 * Script to apply database schema to Supabase
 * Usage: npm run db:apply
 * 
 * Requires SUPABASE_DB_URL environment variable to be set
 * Example: SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
 * 
 * The script automatically loads environment variables from .env.local and .env files
 * (in that order, with .env.local taking precedence).
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Load environment variables from .env files
// Load .env first (lower priority), then .env.local (higher priority)
// This matches Next.js behavior where .env.local overrides .env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const schemaPath = path.join(__dirname, "..", "supabase", "schema.sql");
const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error("❌ Error: SUPABASE_DB_URL environment variable is not set");
  console.error("\nPlease set it in your .env.local or .env file:");
  console.error("SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres");
  console.error("\nNote: .env.local takes precedence over .env if both exist.");
  console.error("\nYou can find your database URL in the Supabase dashboard:");
  console.error("  Settings > Database > Connection string > URI");
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Error: Schema file not found at ${schemaPath}`);
  process.exit(1);
}

console.log("📄 Reading schema file...");

console.log("🚀 Applying schema to Supabase database...");
console.log(`   Database: ${dbUrl.replace(/:[^:@]+@/, ":****@")}`);

try {
  // Use psql to execute the schema
  execSync(`psql "${dbUrl}" -f "${schemaPath}"`, {
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log("✅ Schema applied successfully!");
} catch (error) {
  console.error("❌ Error applying schema:");
  console.error(error.message);
  console.error("\nMake sure you have psql installed and accessible in your PATH.");
  console.error("\nAlternative: Use Supabase CLI:");
  console.error("  1. Install: npm install -g supabase");
  console.error("  2. Link: supabase link --project-ref YOUR_PROJECT_REF");
  console.error("  3. Apply: supabase db push");
  process.exit(1);
}

