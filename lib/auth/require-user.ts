import { auth } from "@clerk/nextjs/server";

import { getCurrentSmartLearnUser } from "./current-user";
import type { SmartLearnUser, UserRole } from "@/types/user";

import { getCourseById } from "@/lib/db/repositories/courses";

export async function requireUser(): Promise<SmartLearnUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return getCurrentSmartLearnUser();
}

export async function requireRole(
  roles: UserRole | UserRole[]
): Promise<SmartLearnUser | null> {
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

export async function requireInstructor(): Promise<SmartLearnUser | null> {
  return requireRole(["instructor", "admin"]);
}

export async function requireAdmin(): Promise<SmartLearnUser | null> {
  return requireRole("admin");
}

export async function requireInstructorOrAdmin(): Promise<SmartLearnUser | null> {
  return requireRole(["instructor", "admin"]);
}

export async function requireStudent(): Promise<SmartLearnUser | null> {
  return requireRole("student");
}

/**
 * Checks whether a given user can edit, update, or delete a specific course.
 * Admins can manage any course; instructors can manage only their own.
 */
export async function canManageCourse(
  courseId: string,
  user: SmartLearnUser
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