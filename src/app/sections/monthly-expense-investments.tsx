"use client";

import React, { useState } from "react";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";
import { useAmounts } from "../store/useAmounts";

interface Item { name: string; amount: number; }
interface Props {
  investments: {
    monthly: Item[];
  };
  month: string;
  daysInMonth: number;
}

export default function MonthlyExpenseInvestments({ investments, month, daysInMonth }: Props) {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<Item[]>(JSON.parse(JSON.stringify(investments.monthly)));
  const [percentage, setPercentage] = useState(100); // Default 100%
  const { availableMoney, essentialsTotal } = useAmounts();

  // Calculate total: (sum of monthly) + (sum of weekly / 7 * days in month)
  // Since investments only have monthly items, weekly total is 0
  const monthlyTotal = items.reduce((sum: number, i: Item) => sum + i.amount, 0);
  const weeklyTotal = 0; // No weekly investments
  const weeklyAdjusted = (weeklyTotal / 7) * daysInMonth;
  const total = monthlyTotal + weeklyAdjusted;

  // Calculate available for investments (subtract essentialsTotal)
  const availableForInvestments = (availableMoney - essentialsTotal) * (percentage / 100);
  const unassigned = availableForInvestments - total;

  const saveChanges = () => {
    const payload = { monthly: items };
    fetch('/api/budget/monthly-budgets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'investments', selectedMonth: month, data: payload })
    }).catch(console.error);
  };

  const toggleEditing = () => {
    if (editing) saveChanges();
    setEditing(p => !p);
  };

  const handleFieldChange = (idx: number, field: "name" | "amount", value: string) => {
    setItems((prev: Item[]) => {
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
        {/* Percentage and Available rows */}
        <div className="flex items-center gap-2">
          <span className="flex-1 font-medium text-[var(--green)]">Percentage</span>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={percentage}
            onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
            className="w-24 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
          />
          <span className="text-[var(--green)]">%</span>
        </div>
        <BudgetItem name="Available" amount={availableForInvestments} color="green" highlight />
        <BudgetItem name="Unassigned" amount={unassigned} color="green" warning={unassigned < 0} highlight />
        <BudgetItem name="Total Investments" amount={total} color="green" highlight />
        <div className="flex flex-col gap-2">
          {editing
            ? items.map((inv: Item, idx: number) => (
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
                <DeleteBtn onClick={() => setItems((prev: Item[]) => prev.filter((_, i) => i !== idx))} />
              </div>
            ))
            : items.map((inv: Item) => (
              <BudgetItem key={inv.name} name={inv.name} amount={inv.amount} color="green" />
            ))}
        </div>
      </div>
    </div >
  );
} 