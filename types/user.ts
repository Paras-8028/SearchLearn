import type { ObjectId } from "mongodb";

export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface SearchLearnUser {
  _id?: ObjectId | string;
  clerkId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SearchLearnUserDTO {
  _id: string;
  clerkId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}