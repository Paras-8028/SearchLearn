import fs from "fs";
import path from "path";
import { SEED_COURSES_DATA } from "./courses-seed-data";

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

async function runSeed() {
  const { createDatabaseIndexes } = await import("../lib/db/indexes");
  const { createCourse, getCourseBySlug } = await import("../lib/db/repositories/courses");
  const { createModule, getModulesByCourseId } = await import("../lib/db/repositories/modules");
  const { createLesson, getLessonsByModuleId } = await import("../lib/db/repositories/lessons");
  const { default: clientPromise } = await import("../lib/db/mongodb");

  console.log("==================================================");
  console.log("🌱 Starting SmartLearn Comprehensive Course Seeding...");
  console.log("==================================================");

  // Initialize DB Indexes
  console.log("🔍 Verifying database indexes...");
  await createDatabaseIndexes();

  // Find an existing instructor or admin from users collection, or use fallback
  const client = await clientPromise;
  const db = client.db("searchlearn");
  const existingUser = await db
    .collection("users")
    .findOne({ role: { $in: ["instructor", "admin"] } });

  const instructorId = existingUser?.clerkId || "instructor_seed_demo";
  console.log(`👤 Using instructor ID: ${instructorId}`);

  let coursesCreated = 0;
  let coursesSkipped = 0;
  let modulesCreated = 0;
  let lessonsCreated = 0;

  for (const courseData of SEED_COURSES_DATA) {
    let course = await getCourseBySlug(courseData.slug);

    if (!course) {
      course = await createCourse({
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        thumbnail: courseData.thumbnail,
        instructorId,
        published: true,
      });
      console.log(`✓ ${course.title} created`);
      coursesCreated++;
    } else {
      console.log(`○ ${course.title} already exists — checking modules`);
      coursesSkipped++;
    }

    const existingModules = await getModulesByCourseId(course._id);

    for (let mIdx = 0; mIdx < courseData.modules.length; mIdx++) {
      const modData = courseData.modules[mIdx];
      let mod = existingModules.find(
        (m) => m.title.toLowerCase() === modData.title.toLowerCase()
      );

      if (!mod) {
        mod = await createModule({
          courseId: course._id,
          title: modData.title,
          description: modData.description,
          order: mIdx + 1,
        });
        modulesCreated++;
      }

      const existingLessons = await getLessonsByModuleId(mod._id);
      const existingLessonTitles = new Set(existingLessons.map((l) => l.title.toLowerCase()));

      for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
        const lessonData = modData.lessons[lIdx];
        if (!existingLessonTitles.has(lessonData.title.toLowerCase())) {
          await createLesson({
            courseId: course._id,
            moduleId: mod._id,
            title: lessonData.title,
            description: lessonData.description,
            contentType: lessonData.contentType,
            duration: lessonData.duration,
            content: lessonData.content,
            videoUrl: lessonData.videoUrl,
            order: lIdx + 1,
            published: true,
          });
          lessonsCreated++;
        }
      }
    }
  }

  console.log("\n--------------------------------------------------");
  console.log(`📊 Seeding Summary:`);
  console.log(`• Courses created: ${coursesCreated}`);
  console.log(`• Courses existing: ${coursesSkipped}`);
  console.log(`• New modules created: ${modulesCreated}`);
  console.log(`• New lessons created: ${lessonsCreated}`);
  console.log("--------------------------------------------------");

  // Optional reindexing
  const shouldReindex = process.argv.includes("--reindex");
  if (shouldReindex) {
    console.log("🔍 Indexing new course content into SearchDocuments with embeddings...");
    try {
      const { indexAllContent } = await import("../lib/search/index-content");
      const stats = await indexAllContent();
      console.log(
        `✨ Indexed ${stats.coursesCount} courses, ${stats.modulesCount} modules, ${stats.lessonsCount} lessons.`
      );
      console.log(`✨ Generated ${stats.embeddingsGenerated} vector embeddings.`);
    } catch (indexErr) {
      console.warn("⚠️ Content indexing skipped or incomplete:", indexErr);
    }
  } else {
    console.log("💡 Tip: To generate OpenAI vector embeddings for all lessons, run:");
    console.log("   npm run reindex");
  }

  console.log("🎉 Course seeding completed successfully!");
  await client.close();
  process.exit(0);
}

runSeed().catch((error) => {
  console.error("❌ Fatal error during course seeding:", error);
  process.exit(1);
});
