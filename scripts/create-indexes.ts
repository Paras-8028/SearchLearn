import { createDatabaseIndexes } from "../lib/db/indexes";

async function main() {
  console.log("Creating and validating SmartLearn MongoDB indexes...");
  try {
    await createDatabaseIndexes();
    console.log("Indexes successfully initialized!");
    process.exit(0);
  } catch (err) {
    console.error("Index creation failed:", err);
    process.exit(1);
  }
}

main();
