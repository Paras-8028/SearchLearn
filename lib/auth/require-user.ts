import { auth } from "@clerk/nextjs/server";

import { getCurrentSearchLearnUser } from "./current-user";
import type { UserRole } from "@/types/user";

import { getCourseById } from "@/lib/db/repositories/courses";
import type { SearchLearnUser } from "@/types/user";

export async function requireUser(): Promise<SearchLearnUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return getCurrentSearchLearnUser();
}

export async function requireRole(
  roles: UserRole | UserRole[]
): Promise<SearchLearnUser | null> {
  const user = await requireUser();

  if (!user) {
    return null;
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return user;
}

export async function requireInstructor(): Promise<SearchLearnUser | null> {
  return requireRole(["instructor", "admin"]);
}

export async function requireAdmin(): Promise<SearchLearnUser | null> {
  return requireRole("admin");
}

export async function requireInstructorOrAdmin(): Promise<SearchLearnUser | null> {
  return requireRole(["instructor", "admin"]);
}

export async function requireStudent(): Promise<SearchLearnUser | null> {
  return requireRole("student");
}

/**
 * Checks whether a given user can edit, update, or delete a specific course.
 * Admins can manage any course; instructors can manage only their own.
 */
export async function canManageCourse(
  courseId: string,
  user: SearchLearnUser
): Promise<boolean> {
  if (user.role === "admin") {
    return true;
  }

  if (user.role !== "instructor") {
    return false;
  }

  const course = await getCourseById(courseId);
  if (!course) {
    return false;
  }

  return course.instructorId === user.clerkId;
}