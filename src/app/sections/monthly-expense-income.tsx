"use client";

import React, { useState, useEffect } from "react";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";
import { useAmounts } from "../store/useAmounts";

interface Item { name: string; amount: number; }

interface Props {
  income: Item[];
  month: string;
  budgetData?: any; // Add budgetData to access previous month's income
}

export default function MonthlyExpenseIncome({ income: initialIncome, month, budgetData }: Props) {
  const [editing, setEditing] = useState(false);
  const [income, setIncome] = useState(JSON.parse(JSON.stringify(initialIncome)));
  const { setAvailableMoney } = useAmounts();

  // helper to persist whole income array
  const saveChanges = () => {
    fetch('/api/budget/monthly-budgets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'income', selectedMonth: month, data: income })
    }).catch(console.error);
  };

  const total = income.reduce((sum: number, item: Item) => sum + item.amount, 0);

  // Calculate available money from previous month's income + next month savings
  const getPreviousMonthIncome = () => {
    if (!budgetData?.monthlyBudgets) return 0;

    const months = [
      "June", "July", "August", "September", "October", "November", "December",
      "January", "February", "March", "April", "May"
    ];

    const currentMonthIndex = months.indexOf(month);
    const previousMonthIndex = currentMonthIndex === 0 ? months.length - 1 : currentMonthIndex - 1;
    const previousMonth = months[previousMonthIndex];

    const previousMonthBudget = budgetData.monthlyBudgets.find((b: any) => b.month === previousMonth);
    if (!previousMonthBudget) return 0;

    // Find the nextMonth section in the previous month's essentials
    const nextMonthSection = previousMonthBudget.essentials?.monthly?.find((s: any) => s.id === 'nextMonth' || s.id === 'nextMonth,');
    let nextMonthSavings = 0;
    if (nextMonthSection?.items) {
      const nextMonthItem = nextMonthSection.items.find((item: any) => item.name === 'Next Month Savings' || item.name === 'Next Month Savings,');
      nextMonthSavings = nextMonthItem?.amount ?? 0;
    }

    // Calculate previous month's income
    const previousMonthIncome = previousMonthBudget.income?.reduce((sum: number, item: Item) => sum + item.amount, 0) ?? 0;

    return previousMonthIncome + nextMonthSavings;
  };

  const availableMoney = getPreviousMonthIncome();

  // Update the store when availableMoney changes
  useEffect(() => {
    setAvailableMoney(availableMoney);
  }, [availableMoney, setAvailableMoney]);

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
        <BudgetItem name="Available Money" amount={availableMoney} color="green" highlight />
      </div>
    </div>
  );
} 