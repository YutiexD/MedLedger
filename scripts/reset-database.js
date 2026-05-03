import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function resetDB() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medledger");
  
  console.log("Wiping all collections...");
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
    console.log(`Cleared collection: ${collection.collectionName}`);
  }

  console.log("Database reset complete! You are ready for the presentation.");
  process.exit(0);
}

resetDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
