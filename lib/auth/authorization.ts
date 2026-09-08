import {
  requireUser,
  requireAdmin,
  requireInstructor,
  requireInstructorOrAdmin,
  requireRole,
  requireStudent,
  canManageCourse,
} from "./require-user";
import { hasPermission, type Permission } from "./permissions";
import type { SmartLearnUser } from "@/types/user";

export {
  requireUser,
  requireAdmin,
  requireInstructor,
  requireInstructorOrAdmin,
  requireRole,
  requireStudent,
  canManageCourse,
  hasPermission,
};

export async function requirePermission(permission: Permission): Promise<SmartLearnUser | null> {
  const user = await requireUser();
  if (!user) return null;

  if (!hasPermission(user.role, permission)) {
    return null;
  }

  return user;
}
