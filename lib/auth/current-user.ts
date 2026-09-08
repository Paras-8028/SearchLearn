import { currentUser } from "@clerk/nextjs/server";

import { ensureUser } from "@/lib/db/repositories/users";
import type { SearchLearnUser, UserRole } from "@/types/user";

export async function getCurrentSearchLearnUser(): Promise<SearchLearnUser | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ?? "";

  const role =
    (clerkUser.publicMetadata?.role as UserRole | undefined) ??
    "student";

  const user = await ensureUser({
    clerkId: clerkUser.id,
    email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return user;
}