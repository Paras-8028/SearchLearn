# SmartLearn — Production Launch Checklist

Follow this checklist prior to public announcement and user onboarding.

---

## 1. Code & Build Verification
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npx tsc --noEmit` passes with 0 type errors.
- [ ] `npm test` passes all 24 automated unit tests.
- [ ] `npm run build` succeeds locally without warnings.
- [ ] No secrets or `.env.local` files tracked by Git (`git status` clean).

---

## 2. Infrastructure & Environment
- [ ] **MongoDB Atlas**:
  - [ ] Dedicated/shared cluster running and healthy.
  - [ ] Network access whitelist allows Vercel (`0.0.0.0/0`).
  - [ ] Production database user credentials verified.
  - [ ] Indexes registered via `npm run db:indexes`.
- [ ] **Clerk Authentication**:
  - [ ] Production instance created in Clerk Dashboard.
  - [ ] `pk_live_...` and `sk_live_...` copied to Vercel Environment Variables.
  - [ ] Production redirect URLs verified (`/sign-in`, `/sign-up`, `/dashboard`).
  - [ ] Production domain added to Clerk allowed origins.
- [ ] **OpenAI API**:
  - [ ] Dedicated production secret key generated.
  - [ ] Sufficient credit balance / billing configured.
  - [ ] Usage spending limits configured to prevent runaway charges.
- [ ] **Vercel Project**:
  - [ ] Repository connected to Vercel.
  - [ ] All 14 production environment variables added.
  - [ ] Deployment status is "Ready" (green).
  - [ ] Custom domain DNS (CNAME/A record) propagated with valid SSL.

---

## 3. End-to-End Functional Checklist

### 3.1 Authentication & User State
- [ ] User can sign up with email / password or OAuth.
- [ ] User receives verification email and completes onboarding.
- [ ] User is redirected to `/dashboard`.
- [ ] User profile and role are created in MongoDB `users` collection.
- [ ] User can sign out and session terminates cleanly.

### 3.2 Courses & Learning
- [ ] Course catalog at `/courses` loads published courses.
- [ ] Course detail page (`/courses/[courseId]`) renders syllabus and module breakdown.
- [ ] Learner can enroll in a course.
- [ ] Learner can access lesson viewer (`/learn/[lessonId]`).
- [ ] Completing a lesson increments the course progress bar.
- [ ] Streak pill and 7-day checklist update on student dashboard.

### 3.3 Search & AI Assistant
- [ ] Search query at `/search` returns hybrid keyword and semantic results.
- [ ] Result clicks are logged via `/api/search/click`.
- [ ] Asking a question triggers `/api/ai/answer` or `/api/ai/ask`.
- [ ] AI answer renders with source citations linked to syllabus lessons.
- [ ] Rate limiter triggers HTTP 429 when firing >10 AI questions rapidly.

### 3.4 Documents & RAG Processing
- [ ] Uploading a `.pdf`, `.txt`, or `.md` file succeeds.
- [ ] Document processing extracts text, generates vector embeddings, and registers chunks.
- [ ] Uploading an invalid file extension (e.g. `.exe`) or empty file is blocked with a friendly error.

### 3.5 Role Governance & Admin Console
- [ ] Student cannot access `/admin` or `/instructor`.
- [ ] Instructor can create courses and lessons at `/instructor/courses/new`.
- [ ] Instructor cannot modify another instructor's course.
- [ ] Admin can view platform metrics, Search Intel, AI Telemetry, and Activity Logs.

### 3.6 Diagnostics & Error Boundaries
- [ ] `GET /api/health` returns `{ "status": "ok", "services": { "database": "connected" } }`.
- [ ] 404 page renders gracefully for invalid URLs with navigation links.
- [ ] Error boundary `app/error.tsx` renders with retry action when an unhandled error occurs.
- [ ] HTTP security headers are present (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
