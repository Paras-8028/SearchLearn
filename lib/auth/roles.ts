import type { UserRole } from "@/types/user";

export function isStudent(role: UserRole): boolean {
  return role === "student";
}

export function isInstructor(role: UserRole): boolean {
  return role === "instructor";
}

export function isValidUserRole(
  role: unknown,
): role is UserRole {
  return role === "student" || role === "instructor";
}