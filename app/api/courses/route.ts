import { NextResponse } from "next/server";
import { createCourse, getCourses, getCourseBySlug } from "@/lib/db/repositories/courses";
import { CreateCourseSchema } from "@/lib/validations/course";
import { requireInstructorOrAdmin } from "@/lib/auth/require-user";
import { slugify } from "@/lib/utils";
import { processLearningContent } from "@/lib/ai/content/processor";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const level = searchParams.get("level") || undefined;
    const instructorId = searchParams.get("instructorId") || undefined;
    const publishedOnlyParam = searchParams.get("publishedOnly");

    // If publishedOnly is not explicitly set to 'false', default to true
    const publishedOnly = publishedOnlyParam === "false" ? false : true;

    const courses = await getCourses({
      publishedOnly,
      search,
      category,
      level,
      instructorId,
    });

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("[GET /api/courses] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireInstructorOrAdmin();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Instructor or Administrator account required to create courses.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = CreateCourseSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    let slug = slugify(data.title);

    const existingCourse = await getCourseBySlug(slug);
    if (existingCourse) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const course = await createCourse({
      ...data,
      slug,
      instructorId: user.clerkId,
    });

    // Background search indexing (non-blocking)
    if (course.published) {
      processLearningContent({
        sourceId: course._id,
        sourceType: "course",
        title: course.title,
        content: course.description,
        courseId: course._id,
        metadata: {
          category: course.category,
          level: course.level,
        },
      }).catch((err) =>
        console.error("[POST /api/courses] Search indexing failed:", err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/courses] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create course" },
      { status: 500 }
    );
  }
}
