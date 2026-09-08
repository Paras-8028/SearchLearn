# SmartLearn

SmartLearn is an AI-powered intelligent learning platform that helps students discover, search, understand, and learn from educational content using semantic search, artificial intelligence, and personalized learning tools.

---

## Key Features

- **Natural Language Semantic Search**: Search across courses, lessons, uploaded documents, notes, and video transcripts using OpenAI vector embeddings combined with keyword search.
- **Curriculum & Lesson Player**: Structured modules and lessons with markdown, rich code blocks, and interactive quizzes.
- **In-Lesson AI Tutor**: Ask questions in the context of lessons, generate summaries, and simplify difficult technical concepts.
- **Document Ingestion & Chunking**: Upload PDF, Markdown, or text documents with automated text extraction, chunking, and embedding generation.
- **Enrollment & Progress Tracking**: Real-time tracking of completed lessons, modules, and completion percentage.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Students, Instructors, and Administrators managed via Clerk.
- **Production Analytics Dashboard**: Real-time administrative metrics for user growth, course enrollments, search volume, AI token usage, and system health.
- **Centralized Logging & Error Handling**: Structured JSON logger with automatic credential redaction, unique request IDs, and safe error boundaries.

---

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **Charting**: [Recharts](https://recharts.org/)
- **Authentication**: [Clerk v7](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas & Node.js Native Driver)
- **AI & Embeddings**: [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`, `text-embedding-3-small`)
- **Validation**: [Zod](https://zod.dev/)

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd search-learn
npm install
```

### 2. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in your configuration:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: from [Clerk Dashboard](https://dashboard.clerk.com).
- `MONGODB_URI`: your MongoDB Atlas connection string.
- `OPENAI_API_KEY`: your OpenAI secret key.

### 3. Initialize Database Indexes

Run the idempotent database index script:

```bash
npm run db:indexes
```

### 4. (Optional) Seed Sample Courses

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
search-learn/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Sign-in and sign-up flows
│   ├── (dashboard)/            # Learner & Instructor dashboards
│   ├── admin/                  # Admin portal & analytics dashboard
│   ├── api/                    # Secure API routes
│   │   ├── admin/analytics/    # Protected analytics endpoints
│   │   └── health/             # Infrastructure health probes
│   ├── courses/                # Course catalog & dynamic details
│   ├── learn/                  # Interactive lesson viewer
│   ├── search/                 # Semantic search interface
│   ├── error.tsx               # Root error boundary
│   ├── global-error.tsx        # Critical shell error boundary
│   ├── not-found.tsx           # Custom 404 page
│   └── layout.tsx              # SEO metadata & Clerk provider
├── components/                 # Reusable UI components
│   ├── admin/                  # Admin dashboard & Recharts components
│   ├── courses/                # Course headers & module lists
│   └── ui/                     # Primitives & shadcn components
├── docs/                       # Architecture & operations documentation
│   ├── deployment.md           # Production deployment guide
│   └── security-checklist.md   # Security verification checklist
├── lib/
│   ├── analytics/              # Date range utilities & aggregation helpers
│   ├── auth/                   # Server authentication & RBAC guards
│   ├── db/                     # MongoDB connection, indexes, and repositories
│   ├── logger/                 # Structured logging & error handling
│   └── env.ts                  # Zod environment validation
└── types/                      # TypeScript domain definitions
    └── analytics.ts            # Analytics data layer contracts
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server on port 3000 |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint analysis |
| `npm run db:indexes` | Creates and validates all MongoDB indexes |
| `npm run seed` | Seeds demo courses, modules, and lessons |
| `npm run reindex` | Re-generates search documents and vector embeddings |

---

## Production Readiness & Deployment

For instructions on deploying to **Vercel** with **MongoDB Atlas**, **Clerk**, and **OpenAI**, see:
- [Deployment Guide](docs/deployment.md)
- [Security Checklist](docs/security-checklist.md)
