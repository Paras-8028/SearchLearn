import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserEnrollments } from "@/lib/db/repositories/enrollments";
import { getLessonsByCourseId } from "@/lib/db/repositories/lessons";

export const revalidate = 0;

export default async function LearnRootPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect=/learn");
  }

  const enrollments = await getUserEnrollments(userId);

  if (enrollments.length > 0) {
    const activeEnrollment = enrollments[0];
    if (activeEnrollment.lastLessonId) {
      redirect(`/learn/${activeEnrollment.lastLessonId}`);
    }

    const lessons = await getLessonsByCourseId(activeEnrollment.courseId);
    if (lessons.length > 0) {
      redirect(`/learn/${lessons[0]._id}`);
    }
  }

  redirect("/courses");
}