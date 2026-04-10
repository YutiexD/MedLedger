require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }
  console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}
test();
