import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { fixedSavings } = await request.json();
    if (!Array.isArray(fixedSavings)) {
      return NextResponse.json(
        { error: "fixedSavings must be an array" },
        { status: 400 }
      );
    }
    await Budget.updateOne({}, { $set: { fixedSavings } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update fixed savings" },
      { status: 500 }
    );
  }
}
