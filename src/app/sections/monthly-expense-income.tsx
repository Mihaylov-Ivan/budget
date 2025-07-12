"use client";

import React, { useState } from "react";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";

interface Item { name: string; amount: number; }

interface Props {
  income: Item[];
  month: string;
}

export default function MonthlyExpenseIncome({ income: initialIncome, month }: Props) {
  const [editing, setEditing] = useState(false);
  const [income, setIncome] = useState(JSON.parse(JSON.stringify(initialIncome)));

  // helper to persist whole income array
  const saveChanges = () => {
    fetch('/api/budget/monthly-budgets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'income', selectedMonth: month, data: income })
    }).catch(console.error);
  };

  const total = income.reduce((sum: number, item: Item) => sum + item.amount, 0);

  const handleFieldChange = (index: number, field: "name" | "amount", value: string) => {
    setIncome((prev: Item[]) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value),
      };
      return copy;
    });
  };

  const toggleEditing = () => {
    if (editing) saveChanges();
    setEditing((p) => !p);
  };

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Income
        </h3>
        <div className="flex gap-2">
          <Add label="Add Income" />
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {editing
            ? income.map((inc: Item, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inc.name}
                  onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                  className="flex-1 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                />
                <input
                  type="number"
                  step="0.01"
                  value={inc.amount}
                  onChange={(e) => handleFieldChange(idx, "amount", e.target.value)}
                  className="w-28 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
                />
                <DeleteBtn onClick={() => setIncome((prev: Item[]) => prev.filter((_, i) => i !== idx))} />
              </div>
            ))
            : income.map((inc: Item) => (
              <BudgetItem key={inc.name} name={inc.name} amount={inc.amount} color="green" />
            ))}
        </div>
        <BudgetItem name="Total Income" amount={total} color="green" highlight />
      </div>
    </div>
  );
} 