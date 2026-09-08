# SmartLearn — Production Security Checklist

This document outlines key security controls and verification procedures for deploying SmartLearn to production.

---

## 1. Authentication & Session Management
- [x] **Clerk v7 Integration**: Session tokens, OAuth, and MFA managed via Clerk's hardened authentication infrastructure.
- [x] **Secure Cookie Handling**: Next.js and Clerk enforce `HttpOnly`, `SameSite=Lax/Strict`, and `Secure` attributes in production.
- [x] **Protected Routes**: Middleware and server-side `auth()` checks guard `/dashboard`, `/admin`, `/learn`, and API endpoints.

## 2. Role-Based Authorization
- [x] **Admin Verification**: All `/admin/*` pages and `/api/admin/*` routes enforce `requireAdmin()` check (role `admin`).
- [x] **Instructor Scoping**: Instructors can only edit and manage courses where `instructorId === user.clerkId`.
- [x] **Least Privilege**: Students cannot access course editing or administrative endpoints.

## 3. Environment Variables & Secrets
- [x] **Separation of Secrets**: Server-side secrets (`CLERK_SECRET_KEY`, `MONGODB_URI`, `OPENAI_API_KEY`) are never prefixed with `NEXT_PUBLIC_`.
- [x] **Redaction in Logs**: Structured logger masks secrets, auth headers, MongoDB URIs, and OpenAI keys automatically.
- [x] **Environment Validation**: `lib/env.ts` validates configuration with Zod.

## 4. API Input Validation & Defense in Depth
- [x] **Strict Validation**: All API routes and search queries validate incoming parameters and payloads using Zod schemas.
- [x] **Pagination Clamping**: API pagination restricts maximum limit to 100 to prevent denial-of-service via large queries.
- [x] **Sanitized Search Terms**: User search strings are trimmed and stripped of dangerous regex operators before vector or text matching.

## 5. Database Security
- [x] **Network Isolation**: MongoDB Atlas IP access list restricted to Vercel production deployment IPs or VPC peering.
- [x] **Dedicated Database User**: Application connects with a dedicated database user scoped with least privilege.
- [x] **Indexed Queries**: Critical collection fields (`clerkId`, `courseId`, `userId`, `createdAt`) are indexed to mitigate slow query bottlenecks.

## 6. OpenAI & AI Safety
- [x] **Server-Side AI Calls**: OpenAI API calls are executed strictly on the server; API keys are never sent to the browser.
- [x] **Token Rate Limiting**: AI request logs track request frequency per user with sliding-window counters to prevent quota exhaustion.
- [x] **Error Shielding**: Raw AI provider errors and OpenAI stack traces are sanitized before sending responses to the client.

## 7. Document Processing Security
- [x] **File Type Validation**: Only permitted file types (`.pdf`, `.txt`, `.md`) are accepted.
- [x] **File Size Limits**: In-memory file processing caps document sizes (10MB limit) to prevent memory exhaustion.
- [x] **Text Extraction Sandboxing**: PDF parsing catches extraction failures without terminating the server process.

## 8. HTTP Security Headers
- [x] **X-Frame-Options**: Set to `DENY` to prevent clickjacking attacks.
- [x] **X-Content-Type-Options**: Set to `nosniff` to prevent MIME-sniffing vulnerabilities.
- [x] **Referrer-Policy**: Set to `strict-origin-when-cross-origin`.
- [x] **Permissions-Policy**: Restricts camera, microphone, and geolocation features.
