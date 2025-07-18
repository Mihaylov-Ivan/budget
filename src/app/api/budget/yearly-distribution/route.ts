import dbConnect from "@/lib/dbConnect";
import Budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { yearlyDistribution } = await request.json();

    if (!yearlyDistribution || typeof yearlyDistribution !== "object") {
      return NextResponse.json(
        { error: "yearlyDistribution must be provided" },
        { status: 400 }
      );
    }

    await Budget.updateOne({}, { $set: { yearlyDistribution } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update yearly distribution" },
      { status: 500 }
    );
  }
}
