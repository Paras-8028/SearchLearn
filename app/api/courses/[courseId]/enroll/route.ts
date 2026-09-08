import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCourseById, getCourseBySlug } from "@/lib/db/repositories/courses";
import { createEnrollment, getEnrollment } from "@/lib/db/repositories/enrollments";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const existingEnrollment = await getEnrollment(userId, course._id);
    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        data: existingEnrollment,
        message: "Already enrolled",
      });
    }

    const enrollment = await createEnrollment(userId, course._id);
    return NextResponse.json(
      {
        success: true,
        data: enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/courses/[courseId]/enroll] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}
