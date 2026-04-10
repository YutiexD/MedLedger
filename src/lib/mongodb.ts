import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log(`[DB] Attempting database connection... (Current cached: ${cached.conn ? "STABLE" : (cached.promise ? "PENDING" : "IDLE")})`);

  if (!MONGODB_URI) {
    console.error("[DB] MONGODB_URI is missing from process.env");
    throw new Error("MONGODB_URI not found");
  }

  if (cached.conn) {
    console.log("[DB] Reusing existing stable connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("[DB] Creating new connection promise...");
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000, // Reduced from default to avoid long app hangs
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("[DB] Connection established successfully.");
        return mongoose;
      })
      .catch((err) => {
        console.error("[DB] Connection failed deeply:", err.message);
        cached.promise = null; // Clear so retry is possible
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null; // Ensure retry on next call
    console.error("[DB] Error awaiting connection promise:", e.message);
    throw e;
  }

  return cached.conn;
}

