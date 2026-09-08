# SmartLearn — Production Deployment Guide

This guide details the complete process for deploying **SmartLearn** to **Vercel** with **MongoDB Atlas**, **Clerk Authentication**, and **OpenAI API**.

---

## Prerequisites

Before starting, ensure you have:
1. A **GitHub** account with access to push code.
2. A **Vercel** account (https://vercel.com).
3. A **MongoDB Atlas** account (https://cloud.mongodb.com).
4. A **Clerk** account (https://clerk.com).
5. An **OpenAI** API account with available credits (https://platform.openai.com).

---

## Step 1 — Push Code to GitHub

Verify your git working directory is clean and push your latest commits:

```bash
git status
git add .
git commit -m "Prepare SmartLearn for production launch"
git push origin main
```

---

## Step 2 — MongoDB Atlas Setup

1. **Create / Select Cluster**:
   - Log into [MongoDB Atlas](https://cloud.mongodb.com).
   - Create a free M0 cluster or production dedicated cluster in your target cloud region (e.g. AWS `us-east-1` for low latency with Vercel).
2. **Configure Database User**:
   - Navigate to **Security** -> **Database Access**.
   - Create a database user (e.g. `searchlearn_prod`) with `Read and write to any database` permissions.
3. **Configure Network Access**:
   - Navigate to **Security** -> **Network Access**.
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere) to allow dynamic Vercel serverless functions to connect.
4. **Retrieve Connection String**:
   - Click **Database** -> **Connect** -> **Drivers** (Node.js).
   - Copy the URI:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
5. **Initialize Production Indexes**:
   - Once connected, run index creation to optimize vector search, enrollments, and user queries:
     ```bash
     npm run db:indexes
     ```

---

## Step 3 — Clerk Authentication Production Setup

1. **Create Production Instance**:
   - Log into [Clerk Dashboard](https://dashboard.clerk.com).
   - In your SmartLearn application, switch environment from **Development** to **Production**.
2. **Retrieve Production Keys**:
   - Navigate to **API Keys**.
   - Copy **Publishable Key**: `pk_live_...`
   - Copy **Secret Key**: `sk_live_...`
3. **Configure Production Domain & Redirects**:
   - Navigate to **Configure** -> **Paths**.
   - Set:
     - Sign-in path: `/sign-in`
     - Sign-up path: `/sign-up`
     - After sign-in redirect URL: `/dashboard`
     - After sign-up redirect URL: `/dashboard`
4. **Add Allowed Origin / Domain**:
   - Once your Vercel deployment URL is generated (e.g. `https://smartlearn.vercel.app` or custom domain `https://smartlearn.app`), add it under **Domains**.

---

## Step 4 — OpenAI Production Setup

1. Log into [OpenAI Platform](https://platform.openai.com).
2. Create a dedicated API key for production:
   - Navigate to **API keys** -> **Create new secret key**.
   - Label it `searchlearn-production`.
   - Copy `sk-...`.
3. Set budget alerts:
   - Navigate to **Settings** -> **Billing** -> **Usage limits**.
   - Configure a soft limit notification (e.g. $20/month) and hard limit to prevent runaway costs.

---

## Step 5 — Deploy on Vercel

1. **Import Repository**:
   - Log into [Vercel](https://vercel.com).
   - Click **Add New...** -> **Project**.
   - Select your GitHub repository (`SmartLearn` or `search-learn`).
2. **Project Settings**:
   - Framework Preset: **Next.js** (auto-detected).
   - Root Directory: `./`
   - Build Command: `next build` (default).
   - Output Directory: `.next` (default).
3. **Configure Environment Variables**:
   In the **Environment Variables** panel, add the following:

   | Variable Name | Value / Description |
   |---|---|
   | `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` (from Clerk production) |
   | `CLERK_SECRET_KEY` | `sk_live_...` (from Clerk production) |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
   | `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
   | `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
   | `MONGODB_URI` | `mongodb+srv://...` (from MongoDB Atlas) |
   | `MONGODB_DB_NAME` | `searchlearn` |
   | `OPENAI_API_KEY` | `sk-...` (from OpenAI) |
   | `OPENAI_CHAT_MODEL` | `gpt-4o-mini` |
   | `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` |
   | `AI_PROVIDER` | `openai` |
   | `MAX_DOCUMENT_SIZE_MB` | `10` |

4. **Deploy**:
   - Click **Deploy**.
   - Vercel will build and deploy the application. Build progress takes ~45-60 seconds.

---

## Step 6 — Post-Deployment Verification

1. **Health Check**:
   - Open: `https://your-domain.vercel.app/api/health`
   - Verify JSON response:
     ```json
     {
       "status": "ok",
       "services": {
         "database": "connected"
       }
     }
     ```
2. **Seed Initial Content (Optional)**:
   - If deploying to a fresh database, run the seed script to populate courses and modules:
     ```bash
     MONGODB_URI="your-production-uri" npm run seed
     ```
   - Build vector search embeddings:
     ```bash
     MONGODB_URI="your-production-uri" OPENAI_API_KEY="your-key" npm run reindex
     ```
