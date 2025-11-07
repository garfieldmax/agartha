#!/usr/bin/env node

/**
 * Script to seed the database with demo data
 * Usage: npm run db:seed
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
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const seedPath = path.join(__dirname, "..", "supabase", "seed.sql");
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

if (!fs.existsSync(seedPath)) {
  console.error(`❌ Error: Seed file not found at ${seedPath}`);
  process.exit(1);
}

console.log("🌱 Seeding database with demo data...");
console.log(`   Database: ${dbUrl.replace(/:[^:@]+@/, ":****@")}`);

try {
  // Use psql to execute the seed file
  execSync(`psql "${dbUrl}" -f "${seedPath}"`, {
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log("✅ Database seeded successfully!");
  console.log("\n📊 Demo data inserted:");
  console.log("   - 10 members (with bios and reputation scores)");
  console.log("   - 2 communities");
  console.log("   - 3 residencies");
  console.log("   - 3 projects (with varied types)");
  console.log("   - 11 project participants (with lead, contributor, mentor, observer roles)");
  console.log("   - 8 kudos (peer recognition)");
  console.log("   - 12 comments (on members, communities, residencies, and projects)");
  console.log("   - 10 interests (skills, hobbies, topics)");
  console.log("   - 17 member-interest links");
  console.log("   - 7 member contacts");
  console.log("   - 7 member goals");
  console.log("   - 12 member connections (social graph)");
  console.log("   - 5 badges");
  console.log("   - 5 badge awards");
} catch (error) {
  console.error("❌ Error seeding database:");
  console.error(error.message);
  console.error("\nMake sure you have psql installed and accessible in your PATH.");
  process.exit(1);
}

