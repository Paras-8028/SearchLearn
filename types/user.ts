export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface SearchLearnUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: UserRole;
}