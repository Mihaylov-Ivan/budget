// Helper functions and actions to interact with MongoDB
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env"
  );
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: GlobalMongoose;
}

let cached: GlobalMongoose = global._mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Explicitly connect to the "budget_2025" database so we always read from the correct DB
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "budget_2025",
    });
  }
  cached.conn = await cached.promise;
  global._mongoose = cached;
  return cached.conn;
}

// Minimal Budget schema just for reading
const BudgetSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    year: Number,
    yearlyDistribution: {
      receivedIncome: Number,
      shouldHave: Number,
      actuallyHave: Number,
      extra: Number,
    },
    fixedSavings: [Object],
    yearlyExpenses: [Object],
    monthlyBudget: Object,
  },
  { collection: "budgets", strict: false }
);

export async function getBudgetData(userId?: string, year?: number) {
  const conn = await dbConnect();
  const Budget = conn.models.Budget || conn.model("Budget", BudgetSchema);

  const query: Record<string, unknown> = {};
  if (userId) query.userId = new mongoose.Types.ObjectId(userId);
  if (year) query.year = year;

  return Budget.findOne(query).lean();
}
