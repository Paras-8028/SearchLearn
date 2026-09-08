import clientPromise from "@/lib/db/mongodb";

export async function createDatabaseIndexes() {
  const client = await clientPromise;

  const db = client.db("searchlearn");

  await db.collection("users").createIndex(
    { clerkId: 1 },
    { unique: true },
  );

  await db.collection("users").createIndex(
    { email: 1 },
  );
}