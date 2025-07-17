"use client";

import React, { useState } from "react";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";
import { useAmounts } from "../store/useAmounts";

// Item with stable uid for React keys
type Item = { _uid: string; name: string; amount: number; percentage?: number };
interface Props {
  investments: {
    percentage?: number;
    monthly: Item[];
  };
  month: string;
  daysInMonth: number;
}

export default function MonthlyExpenseInvestments({ investments, month, daysInMonth }: Props) {
  const [editing, setEditing] = useState(false);
  const genUid = () => Math.random().toString(36).slice(2) + Date.now();
  // Ensure each item has a percentage (default 0 if absent)
  const initializeItems = (arr: any[]) => arr.map((it: any) => ({ _uid: genUid(), ...it, percentage: it.percentage ?? 0 }));
  const [items, setItems] = useState<Item[]>(initializeItems(JSON.parse(JSON.stringify(investments.monthly))));
  const [percentage, setPercentage] = useState(investments.percentage ?? 20);
  const { availableMoney, essentialsTotal } = useAmounts();

  // filter items without names
  const sanitizeItems = (arr: Item[]) => arr.filter((it) => it.name.trim() !== "");

  // Handler to add a new investment row
  const handleAddInvestment = () => {
    // Automatically enable editing if not already
    if (!editing) setEditing(true);
    setItems((prev) => [
      ...prev,
      {
        _uid: genUid(),
        name: "",
        amount: 0,
        percentage: 0,
      },
    ]);
  };

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
    const sanitized = sanitizeItems(items);
    setItems(sanitized);
    const payload = { percentage, monthly: sanitized.map(({ _uid, ...rest }: any) => rest) };
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

  const handleFieldChange = (
    idx: number,
    field: "name" | "amount" | "percentage",
    value: string
  ) => {
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
          {!editing && <Add label="Add Investment" onClick={handleAddInvestment} />}
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Percentage and Available rows */}
        <div className="flex items-center gap-2">
          <span className="flex-1 font-medium text-[var(--green)]">Percentage</span>
          {editing ? (
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
              className="w-24 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
            />
          ) : (
            <span className="w-24 text-right text-[var(--green)]">{percentage.toFixed(2)}</span>
          )}
          <span className="text-[var(--green)]">%</span>
        </div>
        <BudgetItem name="Available" amount={availableForInvestments} color="green" highlight />
        <BudgetItem name="Unassigned" amount={unassigned} color="green" warning={unassigned < 0} highlight />
        <BudgetItem name="Total Investments" amount={total} color="green" highlight />

        {/* Investments list */}
        <div className="flex flex-col gap-2">
          {editing ? (
            <>
              {/* Header row (edit) */}
              <div className="px-4 flex items-center text-sm font-medium text-[var(--gray)] mb-1">
                <span className="flex-1">Name</span>
                <span className="w-20 text-right">Amount</span>
                <span className="w-20 text-right">Should be</span>
                <span className="w-20 text-right">%</span>
                <span className="w-8" />
              </div>
              {items.map((inv: any, idx: number) => {
                const shouldBe = availableForInvestments * ((inv.percentage ?? 0) / 100);
                return (
                  <div key={inv._uid} className="flex gap-2 items-center w-full">
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
                      className="w-20 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
                    />
                    <span className="w-20 text-right">{shouldBe.toFixed(2)}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={inv.percentage ?? 0}
                      onChange={(e) => handleFieldChange(idx, "percentage", e.target.value)}
                      className="w-20 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
                    />
                    <DeleteBtn onClick={() => setItems((prev: any) => prev.filter((it: any) => it._uid !== inv._uid))} />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {/* Header row (view) */}
              <div className="px-4 flex items-center text-sm font-medium text-[var(--gray)] mb-1">
                <span className="flex-1">Name</span>
                <span className="w-20 text-right">Amount</span>
                <span className="w-20 text-right">Should be</span>
                <span className="w-20 text-right">%</span>
              </div>
              {items.map((inv: any) => {
                const shouldBe = availableForInvestments * ((inv.percentage ?? 0) / 100);
                return (
                  <div
                    key={inv._uid}
                    className="bg-[var(--surface-2)] text-[var(--green)] rounded-lg px-4 py-2 flex items-center"
                  >
                    <span className="flex-1">{inv.name}</span>
                    <span className="w-20 text-right">{inv.amount.toFixed(2)}</span>
                    <span className="w-20 text-right">{shouldBe.toFixed(2)}</span>
                    <span className="w-20 text-right">{(inv.percentage ?? 0).toFixed(2)}%</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div >
  );
} 