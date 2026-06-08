import mongoose from "mongoose";

import { validateEnv } from "./env";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCached: MongooseCache;
}

let cached = global.mongooseCached;

if (!cached) {
  cached = global.mongooseCached = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  // Validate environment configuration at runtime when connecting
  validateEnv();

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI environment variable is missing. Please define it in your .env.local or deployment environment."
    );
  }

  // Verify connection string format starts with standard protocol
  if (!MONGODB_URI.startsWith("mongodb+srv://") && !MONGODB_URI.startsWith("mongodb://")) {
    throw new Error(
      "Invalid MONGODB_URI format. The connection string must start with 'mongodb+srv://' or 'mongodb://'"
    );
  }

  // Warn if not using mongodb+srv:// in production (MongoDB Atlas standard)
  if (process.env.NODE_ENV === "production" && !MONGODB_URI.startsWith("mongodb+srv://")) {
    console.warn(
      "⚠️ Warning: MONGODB_URI in production is not using the standard SRV record format (mongodb+srv://). " +
      "It is highly recommended to use mongodb+srv:// for optimal performance, replica set auto-discovery, and scaling in serverless environments."
    );
  }

  if (!cached.promise) {
    // Production-ready configuration optimized for serverless functions (e.g., Vercel) and MongoDB Atlas
    const opts: mongoose.ConnectOptions = {
      // Disable command buffering. If database connection goes down, queries fail instantly
      // instead of queueing up and timing out the Vercel function (cold starts, execution limits).
      bufferCommands: false,
      
      // Control connection pool size. Serverless functions scale horizontally.
      // High pool size per serverless container can quickly exhaust MongoDB Atlas connection limits.
      maxPoolSize: 10,
      
      // Server selection timeout: Fail fast if the DB is unreachable rather than hanging the container.
      serverSelectionTimeoutMS: 5000,
      
      // Socket inactivity timeout. Keeps sockets from lingering.
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("🟢 Connected to MongoDB database successfully.");
      return mongooseInstance;
    }).catch((err) => {
      console.error("🔴 Failed to initialize MongoDB connection:", err);
      cached.promise = null; // Reset promise so next request attempts to reconnect
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

