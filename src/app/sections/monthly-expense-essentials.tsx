"use client";

import React from "react";
import { monthlyBudget } from "../data";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";

function SectionBlock({ title, items }: { title: string; items: { name: string; amount: number }[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-medium text-[var(--gray)]">{title}</h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <BudgetItem key={item.name} name={item.name} amount={item.amount} color="blue" />
        ))}
      </div>
    </div>
  );
}

export default function MonthlyExpenseEssentials() {
  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Essentials
        </h3>
        <Add label="Add Essential" />
      </div>

      {/* Monthly and Weekly Blocks */}
      <BudgetItem name="Total" amount={1000} color="blue" highlight />
      <SectionBlock title="Monthly" items={monthlyBudget.essentials.monthly} />
      <SectionBlock title="Weekly" items={monthlyBudget.essentials.weekly} />
    </div>
  );
} 