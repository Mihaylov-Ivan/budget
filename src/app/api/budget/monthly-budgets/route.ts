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

    // For essentials and luxury, sync changes across all months
    if (field === "essentials" || field === "luxury") {
      const budgetDoc: any = await Budget.findOne({});
      if (budgetDoc && Array.isArray(budgetDoc.monthlyBudgets)) {
        // Helper: sync monthly sections across all months
        const syncMonthlySections = (mb: any, newData: any) => {
          if (!mb[field] || !newData.monthly) return;

          // For each section in the new data
          newData.monthly.forEach((newSection: any) => {
            const targetSection = mb[field].monthly.find(
              (s: any) => s.id === newSection.id
            );
            if (!targetSection) return;

            // Create a map of existing items by name for quick lookup
            const existingItemsMap = new Map();
            targetSection.items.forEach((item: any) => {
              existingItemsMap.set(item.name, item);
            });

            // Update or add items from new data
            const updatedItems = newSection.items.map(
              (newItem: any, index: number) => {
                // Try to find existing item by name first
                let existingItem = existingItemsMap.get(newItem.name);

                // If not found by name, try to find by position (for renamed items)
                if (!existingItem && index < targetSection.items.length) {
                  existingItem = targetSection.items[index];
                }

                if (existingItem) {
                  // Keep existing amount and other properties, only update name
                  return {
                    ...existingItem,
                    name: newItem.name,
                  };
                } else {
                  // New item, set amount to 0 for other months
                  return {
                    ...newItem,
                    amount: 0,
                  };
                }
              }
            );

            targetSection.items = updatedItems;
          });
        };

        // Helper: sync weekly items across all months
        const syncWeeklyItems = (mb: any, newData: any) => {
          if (!mb[field] || !newData.weekly) return;

          // Create a map of existing weekly items by name
          const existingItemsMap = new Map();
          mb[field].weekly.forEach((item: any) => {
            existingItemsMap.set(item.name, item);
          });

          // Update or add weekly items from new data
          const updatedWeeklyItems = newData.weekly.map(
            (newItem: any, index: number) => {
              // Try to find existing item by name first
              let existingItem = existingItemsMap.get(newItem.name);

              // If not found by name, try to find by position (for renamed items)
              if (!existingItem && index < mb[field].weekly.length) {
                existingItem = mb[field].weekly[index];
              }

              if (existingItem) {
                // Keep existing amount and other properties, only update name
                return {
                  ...existingItem,
                  name: newItem.name,
                };
              } else {
                // New item, set amount to 0 for other months
                return {
                  ...newItem,
                  amount: 0,
                };
              }
            }
          );

          mb[field].weekly = updatedWeeklyItems;
        };

        // Apply sync to all months except the selected one
        budgetDoc.monthlyBudgets.forEach((mb: any) => {
          if (mb.month === selectedMonth) return; // skip selected month (already updated)

          syncMonthlySections(mb, data);
          syncWeeklyItems(mb, data);
        });

        // Notify Mongoose about deep changes
        budgetDoc.markModified("monthlyBudgets");
        await budgetDoc.save();
      }
    } else if (field === "investments") {
      // Handle investments sync (existing logic)
      const budgetDoc: any = await Budget.findOne({});
      if (budgetDoc && Array.isArray(budgetDoc.monthlyBudgets)) {
        const syncInvestments = (mb: any) => {
          if (!mb.investments) return;

          // Create a map of existing investments by name for quick lookup
          const existingItemsMap = new Map();
          mb.investments.monthly.forEach((item: any) => {
            existingItemsMap.set(item.name, item);
          });

          // Update or add investments from new data
          const updatedItems = data.monthly.map(
            (newItem: any, index: number) => {
              // Try to find existing item by name first
              let existingItem = existingItemsMap.get(newItem.name);

              // If not found by name, try to find by position (for renamed items)
              if (!existingItem && index < mb.investments.monthly.length) {
                existingItem = mb.investments.monthly[index];
              }

              if (existingItem) {
                // Keep existing amount and other properties, only update name
                return {
                  ...existingItem,
                  name: newItem.name,
                };
              } else {
                // New item, set amount to 0 for other months
                return {
                  ...newItem,
                  amount: 0,
                };
              }
            }
          );

          mb.investments.monthly = updatedItems;
        };

        budgetDoc.monthlyBudgets.forEach((mb: any) => {
          if (mb.month === selectedMonth) return; // skip selected month (already updated)
          syncInvestments(mb);
        });

        // Notify Mongoose about deep changes
        budgetDoc.markModified("monthlyBudgets");
        await budgetDoc.save();
      }
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
