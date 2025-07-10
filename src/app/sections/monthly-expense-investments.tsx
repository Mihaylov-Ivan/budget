"use client";

import React, { useState } from "react";
import { monthlyBudget as initialBudget } from "../data";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";

export default function MonthlyExpenseInvestments() {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState(initialBudget.investments.monthly);

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const toggleEditing = () => setEditing((p) => !p);

  const handleFieldChange = (idx: number, field: "name" | "amount", value: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value),
      };
      return copy;
    });
  };

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Investments
        </h3>
        <div className="flex gap-2">
          <Add label="Add Investment" />
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {editing
            ? items.map((inv, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inv.name}
                  onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                  className="flex-1 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                />
                <input
                  type="number"
                  step="0.01"
                  value={inv.amount}
                  onChange={(e) => handleFieldChange(idx, "amount", e.target.value)}
                  className="w-24 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
                />
                <DeleteBtn onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))} />
              </div>
            ))
            : items.map((inv) => (
              <BudgetItem key={inv.name} name={inv.name} amount={inv.amount} color="green" />
            ))}
        </div>
        <BudgetItem name="Total Investments" amount={total} color="green" highlight />
      </div>
    </div >
  );
} 