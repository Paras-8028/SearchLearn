import { NextResponse } from "next/server";
import { getCourseById, getCourseBySlug } from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByModuleId } from "@/lib/db/repositories/lessons";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    let course = await getCourseById(courseId);
    if (!course) {
      course = await getCourseBySlug(courseId);
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const modules = await getModulesByCourseId(course._id);
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await getLessonsByModuleId(mod._id);
        return {
          ...mod,
          lessons,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        modules: modulesWithLessons,
      },
    });
  } catch (error) {
    console.error("[GET /api/courses/[courseId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}
