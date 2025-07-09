"use client";

import React from "react";
import { monthlyBudget } from "../data";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";

export default function MonthlyExpenseIncome() {
  const total = monthlyBudget.income.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Income
        </h3>
        <Add label="Add Income" />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {monthlyBudget.income.map((inc) => (
          <BudgetItem key={inc.name} name={inc.name} amount={inc.amount} color="green" />
        ))}
        <BudgetItem name="Total Income" amount={total} color="green" highlight />
      </div>
    </div>
  );
} 