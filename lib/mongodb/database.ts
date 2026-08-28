import clientPromise from "./client";

const dbName = process.env.MONGODB_DB_NAME;

if (!dbName) {
  throw new Error("MONGODB_DB_NAME is not defined");
}

export async function getDatabase() {
  const client = await clientPromise;

  return client.db(dbName);
}