import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  year: number;
  yearlyDistribution: {
    receivedIncome: number;
    shouldHave: number;
    actuallyHave: number;
    extra: number;
  };
  fixedSavings: Record<string, unknown>[];
  yearlyExpenses: Record<string, unknown>[];
  monthlyBudgets: Record<string, unknown>[];
}

export interface IBudgetStatics {
  getBudgetData(
    userId?: string,
    year?: number
  ): Promise<IBudgetDocument | null>;
}

export interface IBudgetDocument extends IBudget {}

interface IBudgetModel
  extends IBudgetStatics,
    mongoose.Model<IBudgetDocument> {}

const budgetSchema: Schema<IBudgetDocument> = new Schema(
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
    fixedSavings: [Object],
    yearlyExpenses: [Object],
    monthlyBudgets: [Object],
  },
  { collection: "budgets", timestamps: true }
);

budgetSchema.statics.getBudgetData = async function (
  userId?: string,
  year?: number
) {
  const query: Record<string, unknown> = {};
  if (userId) query.userId = new mongoose.Types.ObjectId(userId);
  if (year) query.year = year;
  return this.findOne(query);
};

export const Budget =
  (mongoose.models.Budget as IBudgetModel) ||
  mongoose.model<IBudgetDocument, IBudgetModel>("Budget", budgetSchema);

// In dev with Next.js the model might be fetched from the cache and miss the statics we just defined
if (typeof (Budget as any).getBudgetData !== "function") {
  (Budget as any).getBudgetData = async function (
    userId?: string,
    year?: number
  ) {
    const query: Record<string, unknown> = {};
    if (userId) query.userId = new mongoose.Types.ObjectId(userId);
    if (year) query.year = year;
    return this.findOne(query);
  };
}

export default Budget;
