import { describe, it, expect } from "vitest";
import { hasPermission } from "@/lib/auth/permissions";

describe("Role-Based Access Control (RBAC) Permissions", () => {
  it("grants students read access to courses and documents", () => {
    expect(hasPermission("student", "courses.read")).toBe(true);
    expect(hasPermission("student", "documents.read")).toBe(true);
  });

  it("prevents students from creating courses or managing users", () => {
    expect(hasPermission("student", "courses.create")).toBe(false);
    expect(hasPermission("student", "users.manage")).toBe(false);
    expect(hasPermission("student", "platform.manage")).toBe(false);
  });

  it("grants instructors course creation and document upload capabilities", () => {
    expect(hasPermission("instructor", "courses.create")).toBe(true);
    expect(hasPermission("instructor", "courses.update")).toBe(true);
    expect(hasPermission("instructor", "documents.upload")).toBe(true);
    expect(hasPermission("instructor", "analytics.read")).toBe(true);
  });

  it("prevents instructors from platform-level governance and user management", () => {
    expect(hasPermission("instructor", "users.manage")).toBe(false);
    expect(hasPermission("instructor", "platform.manage")).toBe(false);
  });

  it("grants admins full platform governance permissions", () => {
    expect(hasPermission("admin", "courses.delete")).toBe(true);
    expect(hasPermission("admin", "users.manage")).toBe(true);
    expect(hasPermission("admin", "documents.reprocess")).toBe(true);
    expect(hasPermission("admin", "platform.manage")).toBe(true);
  });
});
