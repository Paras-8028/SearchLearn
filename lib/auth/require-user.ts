import { auth } from "@clerk/nextjs/server";

import { getCurrentSearchLearnUser } from "./current-user";
import type { UserRole } from "@/types/user";

export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return getCurrentSearchLearnUser();
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (!user) {
    return null;
  }

  if (user.role !== role) {
    return null;
  }

  return user;
}

export async function requireInstructor() {
  return requireRole("instructor");
}

export async function requireStudent() {
  return requireRole("student");
}