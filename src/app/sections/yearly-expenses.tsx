"use client";

import { useEffect, useState, useCallback } from "react";
import Add from "../components/add";
import Button from "../components/button";
import EditBtn from "../components/edit";
import YearlyExpense from "../components/yearly-expense";
import type { YearlyExpenses as YearlyExpenseType } from "../data";

interface Props {
  data: YearlyExpenseType[];
  setData?: (data: YearlyExpenseType[]) => void;
}

const genUid = () => Math.random().toString(36).slice(2) + Date.now();

export default function YearlyExpenses({ data, setData }: Props) {
  const [editing, setEditing] = useState(false);
  const initialize = (arr: any[]) => arr.map((e) => ({ _uid: genUid(), ...e }));
  const [expenses, setExpenses] = useState(initialize(data));

  // Handler to add new yearly expense row
  const handleAddExpense = () => {
    if (!editing) setEditing(true);
    setExpenses(prev => [
      ...prev,
      {
        _uid: genUid(),
        name: "",
        startMonth: "",
        total: 0,
        totalShouldBe: "0",
        monthlySaving: 0,
        saved: 0,
        missed: 0,
        used: 0,
        available: 0,
      } as any,
    ]);
  };

  useEffect(() => {
    setExpenses(initialize(data));
  }, [data]);

  const toggleEditing = () => {
    if (editing) {
      const payload = expenses.map(({ _uid, ...rest }) => rest);
      fetch('/api/budget/yearly-expenses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearlyExpenses: payload }),
      }).catch(console.error);
      setData?.(expenses); // update parent state
    }
    setEditing((p) => !p);
  };

  const handleFieldChange = useCallback((
    index: number,
    field: keyof typeof expenses[number],
    value: string
  ) => {
    setExpenses((prev) => {
      const copy = [...prev];
      //@ts-ignore
      copy[index] = {
        ...copy[index],
        [field]:
          field === "name" || field === "totalShouldBe" || field === "startMonth"
            ? value
            : value === "" ? 0 : parseFloat(value),
      };
      return copy;
    });
  }, []);

  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          Yearly Expense Savings
        </h2>
        <div className="flex gap-2">
          <Add label="Add Yearly Expense" onClick={handleAddExpense} />
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--surface-3)] text-left">
          <thead>
            <tr className="bg-[var(--surface-2)]">
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Expense
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Start Month
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Total
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Total Should Be
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Monthly Saving
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Saved
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Missed
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Used
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Available
              </th>
              {editing && (
                <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-[var(--surface-1)]">
            {editing
              ? expenses.map((exp, idx) => (
                <tr key={exp._uid} className="border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]">
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={exp.name}
                      onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={exp.startMonth}
                      onChange={(e) => handleFieldChange(idx, "startMonth", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={exp.total}
                      onChange={(e) => handleFieldChange(idx, "total", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={exp.totalShouldBe}
                      onChange={(e) => handleFieldChange(idx, "totalShouldBe", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={exp.monthlySaving}
                      onChange={(e) => handleFieldChange(idx, "monthlySaving", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={exp.saved}
                      onChange={(e) => handleFieldChange(idx, "saved", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={exp.missed}
                      onChange={(e) => handleFieldChange(idx, "missed", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={exp.used}
                      onChange={(e) => handleFieldChange(idx, "used", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={exp.available}
                      onChange={(e) => handleFieldChange(idx, "available", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm flex gap-2">
                    <Button
                      label="Saved"
                      onClick={() => { /* TODO: implement saved action */ }}
                    />
                    <Button
                      label="Missed"
                      onClick={() => { /* TODO: implement missed action */ }}
                    />
                    <Button
                      label="Delete"
                      onClick={() => setExpenses((prev) => prev.filter((e) => e._uid !== exp._uid))}
                    />
                  </td>
                </tr>
              ))
              : expenses.map((e) => (
                <YearlyExpense key={e.name} {...e} editing={false} />
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 