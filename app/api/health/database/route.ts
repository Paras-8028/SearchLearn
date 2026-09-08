import { NextResponse } from "next/server";

import clientPromise from "@/lib/db/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    await client.db("admin").command({
      ping: 1,
    });

    return NextResponse.json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    console.error("MongoDB health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        database: "disconnected",
      },
      {
        status: 500,
      },
    );
  }
}