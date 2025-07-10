const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import the data from the local data file
const {
  yearlyDistribution,
  fixedSavings,
  yearlyExpenses,
  monthlyBudget,
} = require("./data");

// After loading data, define target years and months
const yearsToSeed = [2024, 2025, 2026, 2027, 2028];
const fiscalMonths = [
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
];

// Transform monthlyBudget into monthlyBudgets array with month field
function buildMonthlyBudgets(baseBudget: any) {
  return fiscalMonths.map((month) => ({ month, ...baseBudget }));
}

// Define the schema (simplified version for quick setup)
const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    year: { type: Number, required: true },
    yearlyDistribution: {
      receivedIncome: Number,
      shouldHave: Number,
      actuallyHave: Number,
      extra: Number,
    },
    fixedSavings: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: String,
        total: mongoose.Schema.Types.Mixed, // number | "Unlimited"
        saved: Number,
        used: Number,
        available: Number,
      },
    ],
    yearlyExpenses: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: String,
        total: Number,
        totalShouldBe: String,
        monthlySaving: Number,
        saved: Number,
        missed: Number,
        used: Number,
        available: Number,
      },
    ],
    monthlyBudget: {
      income: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          name: String,
          amount: Number,
        },
      ],
      essentials: {
        monthly: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: String,
            amount: Number,
          },
        ],
        weekly: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: String,
            amount: Number,
          },
        ],
      },
      luxury: {
        monthly: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: String,
            amount: Number,
          },
        ],
        weekly: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: String,
            amount: Number,
          },
        ],
      },
      investments: {
        monthly: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: String,
            amount: Number,
          },
        ],
      },
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", BudgetSchema);

async function seedDatabase() {
  try {
    const mongoUriRoot = process.env.MONGODB_URI;
    if (!mongoUriRoot) throw new Error("MONGODB_URI env variable is required");

    // loop through each year and create separate databases
    for (const yr of yearsToSeed) {
      const dbName = `budget_${yr}`;
      const conn = await mongoose
        .createConnection(mongoUriRoot, {
          dbName,
        })
        .asPromise();
      console.log(`Connected to DB: ${dbName}`);

      // Define model within this connection
      const Budget = conn.model(
        "Budget",
        new mongoose.Schema({
          userId: mongoose.Schema.Types.ObjectId,
          year: Number,
          yearlyDistribution: Object,
          fixedSavings: [Object],
          yearlyExpenses: [Object],
          monthlyBudgets: [Object],
        })
      );

      const testUserId = new mongoose.Types.ObjectId();

      // Prepare document data
      const doc = {
        userId: testUserId,
        year: yr,
        yearlyDistribution,
        fixedSavings,
        yearlyExpenses,
        monthlyBudgets: buildMonthlyBudgets(monthlyBudget),
      };

      // Upsert
      await Budget.updateOne({ userId: testUserId, year: yr }, doc, {
        upsert: true,
      });
      console.log(`Seeded data for year ${yr} in DB ${dbName}`);

      await conn.close();
    }
    console.log("All databases seeded successfully!");
  } catch (err) {
    console.error(err);
  }
}

seedDatabase();
