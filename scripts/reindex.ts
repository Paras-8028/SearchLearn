import fs from "fs";
import path from "path";

// 1. Load .env.local BEFORE loading any application module
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex !== -1) {
        const key = trimmed.substring(0, equalsIndex).trim();
        const val = trimmed.substring(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

async function runReindex() {
  console.log("🔍 SmartLearn Reindexing Started...");

  const { createDatabaseIndexes } = await import("../lib/db/indexes");
  const { indexAllContent } = await import("../lib/search/index-content");
  const { default: clientPromise } = await import("../lib/db/mongodb");

  // Ensure DB indexes
  await createDatabaseIndexes();

  const stats = await indexAllContent();

  console.log(`✅ Courses indexed: ${stats.coursesCount}`);
  console.log(`✅ Modules indexed: ${stats.modulesCount}`);
  console.log(`✅ Lessons indexed: ${stats.lessonsCount}`);
  console.log(`✨ Embeddings generated: ${stats.embeddingsGenerated}`);
  console.log("🎉 Search indexing completed successfully.");

  const client = await clientPromise;
  await client.close();
  process.exit(0);
}

runReindex().catch((err) => {
  console.error("❌ Error during search reindexing:", err);
  process.exit(1);
});
