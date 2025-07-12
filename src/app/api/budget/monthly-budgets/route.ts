import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { field, selectedMonth, data } = await request.json();
    if (!selectedMonth || !field) {
      return NextResponse.json(
        { error: "month and field are required" },
        { status: 400 }
      );
    }
    await Budget.updateOne(
      { "monthlyBudgets.month": selectedMonth },
      { $set: { [`monthlyBudgets.$.${field}`]: data } }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update monthly budget" },
      { status: 500 }
    );
  }
}
