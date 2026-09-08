import { requireAdmin as getAdminUser } from "./require-user";
import { AppError } from "@/lib/logger/error-handler";
import type { SmartLearnUser } from "@/types/user";

/**
 * Server-side helper that verifies the current user has the 'admin' role.
 * Returns the SmartLearnUser if valid, or null if unauthenticated or unauthorized.
 */
export async function requireAdmin(): Promise<SmartLearnUser | null> {
  return getAdminUser();
}

/**
 * Server-side helper for API routes and Server Actions that strictly throws
 * an AppError with status 403 if the user is not an administrator.
 */
export async function assertAdmin(): Promise<SmartLearnUser> {
  const user = await getAdminUser();
  if (!user) {
    throw new AppError(
      "Forbidden: Administrator privileges required.",
      403,
      "FORBIDDEN_ADMIN_REQUIRED",
      "authorization"
    );
  }
  return user;
}
