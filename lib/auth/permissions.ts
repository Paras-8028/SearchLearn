import type { UserRole } from "@/types/user";

export type Permission =
  | "courses.read"
  | "courses.create"
  | "courses.update"
  | "courses.delete"
  | "users.read"
  | "users.update"
  | "users.manage"
  | "documents.read"
  | "documents.upload"
  | "documents.delete"
  | "documents.reprocess"
  | "analytics.read"
  | "search.manage"
  | "platform.manage";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    "courses.read",
    "documents.read",
  ],
  instructor: [
    "courses.read",
    "courses.create",
    "courses.update",
    "documents.read",
    "documents.upload",
    "documents.delete",
    "analytics.read",
  ],
  admin: [
    "courses.read",
    "courses.create",
    "courses.update",
    "courses.delete",
    "users.read",
    "users.update",
    "users.manage",
    "documents.read",
    "documents.upload",
    "documents.delete",
    "documents.reprocess",
    "analytics.read",
    "search.manage",
    "platform.manage",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
