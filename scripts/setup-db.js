#!/usr/bin/env node

/**
 * Script to apply schema and seed the database with demo data
 * Usage: npm run db:setup
 * 
 * This combines db:apply and db:seed for initial setup.
 * 
 * Requires SUPABASE_DB_URL environment variable to be set
 * Example: SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
 * 
 * The script automatically loads environment variables from .env.local and .env files
 * (in that order, with .env.local taking precedence).
 */

const path = require("path");
const { execSync } = require("child_process");

// Load environment variables from .env files
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

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

console.log("🚀 Setting up database...");
console.log(`   Database: ${dbUrl.replace(/:[^:@]+@/, ":****@")}\n`);

try {
  // Step 1: Apply schema
  console.log("📋 Step 1: Applying database schema...");
  execSync(`node "${path.join(__dirname, "apply-schema.js")}"`, {
    stdio: "inherit",
  });
  console.log("✅ Schema applied successfully!\n");

  // Step 2: Seed data
  console.log("📋 Step 2: Seeding database with demo data...");
  execSync(`node "${path.join(__dirname, "seed.js")}"`, {
    stdio: "inherit",
  });
  console.log("✅ Database seeded successfully!\n");

  console.log("🎉 Database setup complete!");
  console.log("\nYou can now run your application:");
  console.log("  npm run dev");
} catch (error) {
  console.error("\n❌ Database setup failed");
  console.error("Error:", error.message);
  process.exit(1);
}

