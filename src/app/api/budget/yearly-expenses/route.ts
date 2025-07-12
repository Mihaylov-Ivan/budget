import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { yearlyExpenses } = await request.json();
    if (!Array.isArray(yearlyExpenses)) {
      return NextResponse.json(
        { error: "yearlyExpenses must be an array" },
        { status: 400 }
      );
    }
    await Budget.updateOne({}, { $set: { yearlyExpenses } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update yearly expenses" },
      { status: 500 }
    );
  }
}
