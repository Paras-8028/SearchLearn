import { NextResponse } from "next/server";
import clientPromise from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    dbStatus = "connected";
  } catch (err) {
    console.error("[HealthCheck Error] Database ping failed:", err);
    dbStatus = "disconnected";
  }

  const isHealthy = dbStatus === "connected";
  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: dbStatus,
      },
      latencyMs: responseTimeMs,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
