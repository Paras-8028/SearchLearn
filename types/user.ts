import type { ObjectId } from "mongodb";

export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface SmartLearnUser {
  _id?: ObjectId | string;
  clerkId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SearchLearnUser = SmartLearnUser;

export interface SmartLearnUserDTO {
  _id: string;
  clerkId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type SearchLearnUserDTO = SmartLearnUserDTO;