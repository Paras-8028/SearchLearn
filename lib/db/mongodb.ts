import { MongoClient, ServerApiVersion } from "mongodb";
import { logger } from "@/lib/logger/logger";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/searchlearn";

if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  logger.warn(
    "database",
    "MONGODB_URI is not set in environment variables. Falling back to local default."
  );
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

declare global {
  var mongodbClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.mongodbClientPromise) {
    const client = new MongoClient(uri, options);
    global.mongodbClientPromise = client.connect().catch((err) => {
      logger.error("database", "Failed to connect to MongoDB cluster", err);
      throw err;
    });
  }
  clientPromise = global.mongodbClientPromise;
} else {
  // In serverless production environments, caching on global ensures warm instances reuse connections
  if (!global.mongodbClientPromise) {
    const client = new MongoClient(uri, options);
    global.mongodbClientPromise = client.connect().catch((err) => {
      logger.error("database", "Failed to connect to MongoDB cluster", err);
      throw err;
    });
  }
  clientPromise = global.mongodbClientPromise;
}

export default clientPromise;