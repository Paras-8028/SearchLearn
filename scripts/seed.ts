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

async function runSeed() {
  // Dynamically import database repositories after environment variables are loaded
  const { createDatabaseIndexes } = await import("../lib/db/indexes");
  const { createCourse, getCourseBySlug } = await import("../lib/db/repositories/courses");
  const { createModule, getModulesByCourseId } = await import("../lib/db/repositories/modules");
  const { createLesson } = await import("../lib/db/repositories/lessons");
  const { default: clientPromise } = await import("../lib/db/mongodb");

  console.log("🌱 Starting SearchLearn Database Seed...");

  // Initialize DB Indexes
  console.log("🔍 Creating database indexes...");
  await createDatabaseIndexes();

  const mockInstructorId = "instructor_seed_demo";

  // Course 1: JavaScript Fundamentals
  const jsSlug = "javascript-fundamentals";
  let jsCourse = await getCourseBySlug(jsSlug);

  if (!jsCourse) {
    console.log("✨ Creating course: JavaScript Fundamentals");
    jsCourse = await createCourse({
      title: "JavaScript Fundamentals",
      slug: jsSlug,
      description:
        "Master the core syntax, data types, function scope, asynchronous programming, and DOM concepts of modern JavaScript.",
      category: "Web Development",
      level: "beginner",
      thumbnail:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1000&auto=format&fit=crop",
      instructorId: mockInstructorId,
      published: true,
    });
  } else {
    console.log("ℹ️ Course 'JavaScript Fundamentals' already exists.");
  }

  // Modules for JS Fundamentals
  const jsModulesData = [
    {
      title: "Introduction to JavaScript",
      description: "Getting started with JavaScript history, execution engine, and setup.",
      order: 1,
      lessons: [
        {
          title: "Welcome to JavaScript & V8 Engine",
          contentType: "article" as const,
          duration: 8,
          order: 1,
          content:
            "JavaScript is the scripting language of the web. It is interpreted or JIT-compiled with first-class functions. In this lesson, we cover runtime environments like Node.js and modern browser execution engines.",
        },
        {
          title: "Executing Your First Script",
          contentType: "video" as const,
          duration: 12,
          videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
          order: 2,
          content: "Learn how to connect JavaScript to your HTML files and use console.log effectively.",
        },
      ],
    },
    {
      title: "Variables and Data Types",
      description: "Understand var, let, const, primitive types, and objects.",
      order: 2,
      lessons: [
        {
          title: "Understanding var, let, and const",
          contentType: "article" as const,
          duration: 10,
          order: 1,
          content:
            "Scope matters! Discover why 'let' and 'const' were introduced in ES6 to solve variable hoisting and block-scoping issues created by 'var'.",
        },
        {
          title: "Primitive Data Types vs Reference Types",
          contentType: "article" as const,
          duration: 15,
          order: 2,
          content:
            "Strings, Numbers, Booleans, Null, Undefined, BigInt, and Symbols are primitives copied by value. Objects, Arrays, and Functions are copied by reference.",
        },
      ],
    },
    {
      title: "Functions",
      description: "Function declarations, expressions, arrow functions, and closures.",
      order: 3,
      lessons: [
        {
          title: "Function Declarations vs Arrow Functions",
          contentType: "article" as const,
          duration: 12,
          order: 1,
          content:
            "Explore function signatures, default parameters, rest parameters, and lexical 'this' binding in ES6 arrow functions.",
        },
        {
          title: "Closures and Lexical Scope",
          contentType: "article" as const,
          duration: 14,
          order: 2,
          content:
            "A closure is the combination of a function bundled together with references to its surrounding state. Closures give you access to an outer function scope from an inner function.",
        },
      ],
    },
    {
      title: "Async JavaScript",
      description: "Callbacks, Promises, and Async/Await.",
      order: 4,
      lessons: [
        {
          title: "Understanding the Event Loop & Promises",
          contentType: "video" as const,
          duration: 18,
          videoUrl: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
          order: 1,
          content: "Learn how the JavaScript call stack, web APIs, callback queue, and microtask queue interact.",
        },
        {
          title: "Mastering Async/Await Syntax",
          contentType: "quiz" as const,
          duration: 10,
          order: 2,
          content: "Test your knowledge on converting Promise chains to clean async/await try-catch blocks.",
        },
      ],
    },
  ];

  const existingJsModules = await getModulesByCourseId(jsCourse._id);
  if (existingJsModules.length === 0) {
    for (const mData of jsModulesData) {
      const createdMod = await createModule({
        courseId: jsCourse._id,
        title: mData.title,
        description: mData.description,
        order: mData.order,
      });

      for (const lData of mData.lessons) {
        await createLesson({
          courseId: jsCourse._id,
          moduleId: createdMod._id,
          title: lData.title,
          contentType: lData.contentType,
          duration: lData.duration,
          content: lData.content,
          videoUrl: lData.videoUrl,
          order: lData.order,
          published: true,
        });
      }
    }
    console.log("✅ Created JS Fundamentals modules and lessons.");
  } else {
    console.log("ℹ️ JS Fundamentals modules already populated.");
  }

  // Course 2: Introduction to Machine Learning
  const mlSlug = "introduction-to-machine-learning";
  let mlCourse = await getCourseBySlug(mlSlug);

  if (!mlCourse) {
    console.log("✨ Creating course: Introduction to Machine Learning");
    mlCourse = await createCourse({
      title: "Introduction to Machine Learning",
      slug: mlSlug,
      description:
        "Understand foundational AI principles, supervised vs unsupervised learning, data preprocessing, and introductory neural networks.",
      category: "Artificial Intelligence",
      level: "intermediate",
      thumbnail:
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop",
      instructorId: mockInstructorId,
      published: true,
    });
  } else {
    console.log("ℹ️ Course 'Introduction to Machine Learning' already exists.");
  }

  const mlModulesData = [
    {
      title: "Machine Learning Basics",
      description: "Overview of machine learning taxonomy, features, target labels, and dataset splitting.",
      order: 1,
      lessons: [
        {
          title: "What is Machine Learning?",
          contentType: "article" as const,
          duration: 10,
          order: 1,
          content:
            "Machine learning allows computers to learn from experience (data) rather than being explicitly programmed for every rule.",
        },
        {
          title: "Supervised vs Unsupervised Learning",
          contentType: "video" as const,
          duration: 15,
          videoUrl: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
          order: 2,
          content: "Learn how labeled training data differs from clustering and dimensionality reduction.",
        },
      ],
    },
    {
      title: "Supervised Learning",
      description: "Linear regression, logistic regression, and decision trees.",
      order: 2,
      lessons: [
        {
          title: "Linear Regression & Gradient Descent",
          contentType: "article" as const,
          duration: 16,
          order: 1,
          content:
            "Linear regression predicts continuous target variables by fitting a line or hyperplane through data points using mean squared error minimization.",
        },
        {
          title: "Classification with Logistic Regression",
          contentType: "article" as const,
          duration: 14,
          order: 2,
          content:
            "Logistic regression uses the sigmoid activation function to map predicted continuous values to probabilities between 0 and 1.",
        },
      ],
    },
    {
      title: "Neural Networks",
      description: "Perceptrons, multi-layer networks, activation functions, and backpropagation.",
      order: 3,
      lessons: [
        {
          title: "Anatomy of an Artificial Neuron",
          contentType: "video" as const,
          duration: 20,
          videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
          order: 1,
          content: "Understand weights, biases, ReLU activations, and forward propagation in deep learning models.",
        },
        {
          title: "Neural Network Fundamentals Quiz",
          contentType: "quiz" as const,
          duration: 12,
          order: 2,
          content: "Test your understanding of cost functions, learning rate hyper-parameters, and overfitting.",
        },
      ],
    },
  ];

  const existingMlModules = await getModulesByCourseId(mlCourse._id);
  if (existingMlModules.length === 0) {
    for (const mData of mlModulesData) {
      const createdMod = await createModule({
        courseId: mlCourse._id,
        title: mData.title,
        description: mData.description,
        order: mData.order,
      });

      for (const lData of mData.lessons) {
        await createLesson({
          courseId: mlCourse._id,
          moduleId: createdMod._id,
          title: lData.title,
          contentType: lData.contentType,
          duration: lData.duration,
          content: lData.content,
          videoUrl: lData.videoUrl,
          order: lData.order,
          published: true,
        });
      }
    }
    console.log("✅ Created Machine Learning modules and lessons.");
  } else {
    console.log("ℹ️ Machine Learning modules already populated.");
  }

  console.log("🎉 Database Seed Completed Successfully!");
  const client = await clientPromise;
  await client.close();
  process.exit(0);
}

runSeed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
