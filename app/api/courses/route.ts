import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createCourse, getCourses, getCourseBySlug } from "@/lib/db/repositories/courses";
import { CreateCourseSchema } from "@/lib/validations/course";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const level = searchParams.get("level") || undefined;

    const courses = await getCourses({
      publishedOnly: true,
      search,
      category,
      level,
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
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
      instructorId: userId,
    });

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
