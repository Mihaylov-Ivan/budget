"use client";

import React from "react";
import { monthlyBudget } from "../data";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";

export default function MonthlyExpenseInvestments() {
  const total = monthlyBudget.investments.monthly.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Investments
        </h3>
        <Add label="Add Investment" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {monthlyBudget.investments.monthly.map((inv) => (
            <BudgetItem key={inv.name} name={inv.name} amount={inv.amount} color="green" />
          ))}
        </div>
        <BudgetItem name="Total Investments" amount={total} color="green" highlight />
      </div>
    </div >
  );
} 