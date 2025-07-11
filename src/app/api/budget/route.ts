import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const budget = await Budget.getBudgetData();
    return NextResponse.json(budget);
  } catch (error: any) {
    return NextResponse.json(
      { error: "An error occurred fetching the budget" },
      { status: 500 }
    );
  }
}
