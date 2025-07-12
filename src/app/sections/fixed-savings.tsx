"use client";

import React, { useState } from "react";
import Add from "../components/add";
import FixedSaving from "../components/fixed-saving";
import Edit from "../components/edit";
import type { FixedSavings as FixedSavingType } from "../data";

interface Props {
  data: FixedSavingType[];
}

export default function FixedSavings({ data }: Props) {
  const [editing, setEditing] = useState(false);
  const [savings, setSavings] = useState(data);

  const handleToggleEdit = () => {
    if (editing) {
      // Persist to DB when leaving edit mode
      fetch('/api/budget/fixed-savings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixedSavings: savings }),
      }).catch(console.error);
    }
    setEditing((prev) => !prev);
  };

  const handleFieldChange = (index: number, field: keyof typeof savings[number], value: string) => {
    setSavings((prev) => {
      const copy = [...prev];
      //@ts-ignore
      copy[index] = { ...copy[index], [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value) };
      return copy;
    });
  };

  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          Fixed Savings
        </h2>
        <div className="flex gap-2">
          <Add label="Add Saving Goal" />
          <Edit onClick={handleToggleEdit} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--surface-3)] text-left">
          <thead>
            <tr className="bg-[var(--surface-2)]">
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Saving
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Total
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Saved
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Used
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Available to Use
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
              ? savings.map((saving, idx) => (
                <tr key={saving.name} className="border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]">
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={saving.name}
                      onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={typeof saving.total === "number" ? saving.total : 0}
                      onChange={(e) => handleFieldChange(idx, "total", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={saving.saved}
                      onChange={(e) => handleFieldChange(idx, "saved", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={saving.used}
                      onChange={(e) => handleFieldChange(idx, "used", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={saving.available}
                      onChange={(e) => handleFieldChange(idx, "available", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm flex gap-2">
                    {/* Delete still available while editing */}
                    <button
                      onClick={() => setSavings((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-2 rounded-lg border border-[var(--surface-4)] hover:bg-[var(--surface-4)]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
              : savings.map((saving) => (
                <FixedSaving key={saving.name} {...saving} editing={false} />
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 