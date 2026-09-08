# SmartLearn — Production Deployment Guide

This guide details the steps to deploy SmartLearn to Vercel with MongoDB Atlas, Clerk, and OpenAI.

---

## 1. Prerequisites

Before deploying, ensure you have active accounts for:
- [Vercel](https://vercel.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Clerk](https://clerk.com)
- [OpenAI](https://platform.openai.com)

---

## 2. MongoDB Atlas Setup

1. **Create a Cluster**: Provision an Atlas M0 (free) or dedicated tier cluster.
2. **Database Access**:
   - Create a database user with `readWrite` permissions on database `searchlearn`.
   - Store credentials securely.
3. **Network Access**:
   - Add `0.0.0.0/0` (Allow access from anywhere) or configure Vercel Integration for MongoDB Atlas.
4. **Copy Connection String**:
   - Select **Connect** → **Drivers** (Node.js).
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
5. **Run Index Creation**:
   - Before traffic goes live, run:
     ```bash
     npm run db:indexes
     ```

---

## 3. Clerk Production Instance

1. In the Clerk Dashboard, switch from **Development** to **Production**.
2. Under **API Keys**, copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_...`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_...`)
3. Under **Paths**, configure:
   - Sign in URL: `/sign-in`
   - Sign up URL: `/sign-up`
   - After sign in URL: `/dashboard`
   - After sign up URL: `/dashboard`
4. Assign the first administrator role in Clerk Dashboard:
   - Navigate to **Users** → Select your user → **Public Metadata** → Set `{"role": "admin"}`.

---

## 4. OpenAI Production Setup

1. Obtain a production API key from OpenAI Platform (`sk-...`).
2. Configure **Usage Limits** (Hard limit and Soft alert thresholds) to avoid unexpected billing spikes.
3. Recommended models:
   - Completion / Chat: `gpt-4o-mini` or `gpt-4o`
   - Embeddings: `text-embedding-3-small` (1536 dimensions)

---

## 5. Vercel Deployment

1. **Import Repository**:
   - Link your GitHub repository to a new Vercel project.
   - Framework preset: **Next.js**.
   - Root directory: `./`.
2. **Configure Environment Variables**:
   Add the following in Vercel **Settings** → **Environment Variables**:

   | Variable | Value Description |
   |---|---|
   | `NEXT_PUBLIC_APP_URL` | Your production custom domain or `https://<project>.vercel.app` |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk production publishable key (`pk_live_...`) |
   | `CLERK_SECRET_KEY` | Clerk production secret key (`sk_live_...`) |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
   | `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
   | `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
   | `MONGODB_URI` | MongoDB Atlas SRV connection string |
   | `MONGODB_DB_NAME` | `searchlearn` |
   | `OPENAI_API_KEY` | OpenAI secret API key (`sk-...`) |
   | `AI_PROVIDER` | `openai` |

3. **Deploy**:
   - Click **Deploy**. Vercel will run `npm run build` and provision the serverless bundle.

---

## 6. Post-Deployment Verification

1. **Database Health**:
   - Visit `https://<your-domain>/api/health/database` and verify `{ "success": true, "database": "connected" }`.
2. **Admin Dashboard**:
   - Log in with your admin account.
   - Navigate to `/admin` and verify KPI stat cards, charts, and system health badges.
3. **Semantic Search**:
   - Navigate to `/search` and execute a natural language test query.
4. **AI Assistant**:
   - Open a lesson in `/learn` and verify AI tutoring responses.
