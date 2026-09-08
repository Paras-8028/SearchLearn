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

async function verifySeededData() {
  const { default: clientPromise } = await import("../lib/db/mongodb");

  const client = await clientPromise;
  const db = client.db("searchlearn");

  const courses = await db.collection("courses").find({}).toArray();
  const modules = await db.collection("modules").find({}).toArray();
  const lessons = await db.collection("lessons").find({}).toArray();

  console.log("==========================================");
  console.log("📊 SmartLearn Database Content Summary");
  console.log("==========================================");
  console.log(`Total Courses: ${courses.length}`);
  console.log(`Total Modules: ${modules.length}`);
  console.log(`Total Lessons: ${lessons.length}`);
  console.log("------------------------------------------");

  for (const c of courses) {
    const cMods = modules.filter((m) => m.courseId.toString() === c._id.toString());
    const cLessons = lessons.filter((l) => l.courseId.toString() === c._id.toString());
    console.log(`• [${c.category || "General"}] ${c.title} (${c.level || "beginner"})`);
    console.log(`   -> ${cMods.length} modules, ${cLessons.length} lessons`);
  }

  console.log("==========================================");
  await client.close();
}

verifySeededData().catch(console.error);
