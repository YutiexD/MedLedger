const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }
  console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));
  try {
    // Increase timeout to see clearly if it fails
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }); 
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}
test();
