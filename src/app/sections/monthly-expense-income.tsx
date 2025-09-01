"use client";

import React, { useState, useEffect } from "react";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";
import { useAmounts } from "../store/useAmounts";
import { months } from "../data";

interface Item { name: string; amount: number; }

interface Props {
  income: Item[];
  month: (typeof months)[number];
  budgetData?: any; // Add budgetData to access previous month's income
}

const genUid = () => Math.random().toString(36).slice(2) + Date.now();

export default function MonthlyExpenseIncome({ income: initialIncome, month, budgetData }: Props) {
  const [editing, setEditing] = useState(false);
  const initIncome = (arr: any[]) => arr.map((it) => ({ _uid: genUid(), ...it }));
  // Filter out Available Money from UI state to avoid duplication
  const filteredInitialIncome = initialIncome.filter((item: any) => item.name !== 'Available Money');
  const [income, setIncome] = useState(initIncome(JSON.parse(JSON.stringify(filteredInitialIncome))));
  const { setAvailableMoney } = useAmounts();
  const [manualAvailableMoney, setManualAvailableMoney] = useState<number | null>(null);

  // Handler to add new income row
  const handleAddIncome = () => {
    // Ensure we are editing
    if (!editing) setEditing(true);
    setIncome((prev: any) => [
      ...prev,
      { _uid: genUid(), name: "", amount: 0 },
    ]);
  };

  // Helper to strip items with empty names and exclude Available Money
  const sanitizeData = () => {
    return income.filter((it) => it.name.trim() !== "" && it.name !== 'Available Money');
  };

  // helper to persist whole income array
  const saveChanges = () => {
    const sanitizedIncome = sanitizeData();

    // For first month, include Available Money in the income array for database
    let incomeToSave = sanitizedIncome.map(({ _uid, ...rest }: any) => rest);

    if (isFirstMonth && manualAvailableMoney !== null) {
      // Add or update Available Money in the income array
      const existingAvailableMoneyIndex = incomeToSave.findIndex((item: any) => item.name === 'Available Money');
      if (existingAvailableMoneyIndex >= 0) {
        incomeToSave[existingAvailableMoneyIndex].amount = manualAvailableMoney;
      } else {
        incomeToSave.push({ name: 'Available Money', amount: manualAvailableMoney });
      }
    }

    // Reflect sanitized data in state so UI matches DB (but exclude Available Money from UI state)
    const uiIncome = sanitizedIncome.filter((item: any) => item.name !== 'Available Money');
    setIncome(uiIncome);

    fetch('/api/budget/monthly-budgets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'income', selectedMonth: month, data: incomeToSave })
    })
      .then(() => {
        // Refresh the budget data to reflect changes across all months
        return fetch('/api/budget');
      })
      .then((res) => res?.json?.())
      .catch(console.error);
  };

  const total = income.filter((item: Item) => item.name !== 'Available Money').reduce((sum: number, item: Item) => sum + item.amount, 0);

  const isFirstMonth = month === months[0];

  // Calculate available money as the total income from the previous month
  const getPreviousMonthIncome = () => {
    if (!budgetData?.monthlyBudgets) return 0;

    const currentMonthIndex = months.indexOf(month);
    const previousMonthIndex = currentMonthIndex === 0 ? months.length - 1 : currentMonthIndex - 1;
    const previousMonth = months[previousMonthIndex];

    const previousMonthBudget = budgetData.monthlyBudgets.find((b: any) => b.month === previousMonth);
    if (!previousMonthBudget) return 0;

    // Calculate previous month's income (excluding 'Available Money')
    const previousMonthIncome = previousMonthBudget.income?.
      filter((item: Item) => item.name !== 'Available Money').
      reduce((sum: number, item: Item) => sum + item.amount, 0) ?? 0;

    return previousMonthIncome;
  };

  const availableMoney = getPreviousMonthIncome();

  // Initialize manualAvailableMoney from database for first month
  useEffect(() => {
    if (isFirstMonth && budgetData?.monthlyBudgets && manualAvailableMoney === null) {
      const firstMonthBudget = budgetData.monthlyBudgets.find((b: any) => b.month === month);
      if (firstMonthBudget?.income) {
        const availableMoneyItem = firstMonthBudget.income.find((item: any) => item.name === 'Available Money');
        if (availableMoneyItem) {
          setManualAvailableMoney(availableMoneyItem.amount);
        }
      }
    }
  }, [isFirstMonth, budgetData, month, manualAvailableMoney]);


  useEffect(() => {
    setAvailableMoney(availableMoney);
  }, [availableMoney, setAvailableMoney]);

  const handleFieldChange = (index: number, field: "name" | "amount", value: string) => {
    setIncome((prev: any) => {
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

  type ItemWithUid = Item & { _uid: string };

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Income
        </h3>
        <div className="flex gap-2">
          {!editing && <Add label="Add Income" onClick={handleAddIncome} />}
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {editing
            ? income.map((inc: any, idx: number) => (
              <div key={inc._uid} className="flex gap-2 items-center">
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
                <DeleteBtn onClick={() => setIncome((prev: any) => prev.filter((it: any) => it._uid !== inc._uid))} />
              </div>
            ))
            : income.map((inc: any) => (
              <BudgetItem key={inc._uid} name={inc.name} amount={inc.amount} color="green" />
            ))}
        </div>
        <BudgetItem name="Total Income" amount={total} color="green" highlight />
        <div>
          {isFirstMonth ? (
            editing ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={"Available Money"}
                  disabled
                  className="flex-1 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 font-semibold"
                />
                <input
                  type="number"
                  step="0.01"
                  value={manualAvailableMoney !== null ? manualAvailableMoney : ""}
                  onChange={e => setManualAvailableMoney(e.target.value === "" ? null : parseFloat(e.target.value))}
                  className="w-28 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
                  placeholder="Enter available money"
                />
              </div>
            ) : (
              <BudgetItem name="Available Money" amount={availableMoney} color="green" highlight />
            )
          ) : (
            <BudgetItem name="Available Money" amount={availableMoney} color="green" highlight />
          )}
        </div>
      </div>
    </div>
  );
} 