import mongoose from "mongoose";

const connectionString = process.env.MONGODB_URL || process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error("Please provide a valid MongoDB connection string.");
}

async function dbConnect() {
  mongoose.set("strictQuery", true);

  if (mongoose.connection?.readyState >= 1) return;

  try {
    await mongoose.connect(connectionString as string, {
      dbName: "budget_2025", // ensure we use the correct database
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB.");
  }
}

export default dbConnect;
