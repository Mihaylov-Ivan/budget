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
    // Update the selected month
    await Budget.updateOne(
      { "monthlyBudgets.month": selectedMonth },
      { $set: { [`monthlyBudgets.$.${field}`]: data } }
    );

    // Propagate any NEW items across the rest of the months so that they exist with zero amounts
    const budgetDoc: any = await Budget.findOne({});
    if (budgetDoc && Array.isArray(budgetDoc.monthlyBudgets)) {
      // Helper: sync investments.monthly across months (add missing, remove deleted)
      const syncInvestments = (mb: any) => {
        if (!mb.investments) return;
        const incomingNames = data.monthly.map((it: any) => it.name);
        // Only ADD missing investments; do not remove existing ones in other months
        incomingNames.forEach((name: string) => {
          if (!mb.investments.monthly.find((it: any) => it.name === name)) {
            const source = data.monthly.find((it: any) => it.name === name);
            mb.investments.monthly.push({
              name,
              amount: 0,
              percentage: source?.percentage ?? 0,
            });
          }
        });
      };

      // Helper: sync items for essentials/luxury expenses section
      const syncMonthlySectionItems = (
        mb: any,
        sectionId: string,
        newSections: any[]
      ) => {
        const targetSection = mb[field]?.monthly?.find(
          (s: any) => s.id === sectionId
        );
        const newSection = newSections.find((s: any) => s.id === sectionId);
        if (!targetSection || !newSection) return;

        const incomingNames = newSection.items.map((it: any) => it.name);
        // Only ADD missing items; do not remove existing ones in other months
        incomingNames.forEach((name: string) => {
          if (!targetSection.items.find((it: any) => it.name === name)) {
            targetSection.items.push({ name, amount: 0 });
          }
        });
      };

      budgetDoc.monthlyBudgets.forEach((mb: any) => {
        if (mb.month === selectedMonth) return; // skip selected month (already updated)

        if (field === "investments") {
          syncInvestments(mb);
        } else if (field === "luxury" || field === "essentials") {
          syncMonthlySectionItems(mb, "expenses", data.monthly);
        }
      });

      // Notify Mongoose about deep changes
      budgetDoc.markModified("monthlyBudgets");

      await budgetDoc.save();
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update monthly budget" },
      { status: 500 }
    );
  }
}
