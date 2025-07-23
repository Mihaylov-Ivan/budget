"use client";

import { useCallback, useState } from "react";
import Add from "../components/add";
import Delete from "../components/delete";
import Edit from "../components/edit";
import FixedSaving from "../components/fixed-saving";
import type { FixedSavings as FixedSavingType } from "../data";
const genUid = () => Math.random().toString(36).slice(2) + Date.now();

interface Props {
  data: FixedSavingType[];
}

export default function FixedSavings({ data }: Props) {
  const [editing, setEditing] = useState(false);
  // Attach a stable _uid to each row for reliable keying
  const initializeSavings = (arr: any[]) => arr.map((s) => ({ _uid: genUid(), ...s }));
  const [savings, setSavings] = useState(initializeSavings(data));

  // Handler to add new saving row
  const handleAddSaving = () => {
    if (!editing) setEditing(true);
    setSavings(prev => [
      ...prev,
      {
        _uid: genUid(),
        name: "",
        total: 0,
        saved: 0,
        used: 0,
        available: 0,
      } as any,
    ]);
  };

  const handleToggleEdit = () => {
    if (editing) {
      const sanitized = savings.filter((s) => s.name.trim() !== "");
      setSavings(sanitized);
      // Persist to DB when leaving edit mode
      const payload = sanitized.map(({ _uid, ...rest }) => rest);
      fetch('/api/budget/fixed-savings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixedSavings: payload }),
      }).catch(console.error);
    }
    setEditing((prev) => !prev);
  };

  const handleFieldChange = useCallback((index: number, field: keyof typeof savings[number], value: string) => {
    setSavings((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value) };
      return copy;
    });
  }, []);

  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          Fixed Savings
        </h2>
        <div className="flex gap-2">
          {!editing && <Add label="Add Saving Goal" onClick={handleAddSaving} />}
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
              ? savings.map((saving, idx) => (
                <tr key={saving._uid} className="border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]">
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={saving.name}
                      onChange={(e) => handleFieldChange(idx as number, "name", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={typeof saving.total === "number" ? saving.total : 0}
                      onChange={(e) => handleFieldChange(idx as number, "total", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={saving.saved}
                      onChange={(e) => handleFieldChange(idx as number, "saved", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={saving.used}
                      onChange={(e) => handleFieldChange(idx as number, "used", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={saving.available}
                      onChange={(e) => handleFieldChange(idx as number, "available", e.target.value)}
                      className="w-full bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-sm flex gap-2 justify-center items-center">
                    {/* Delete still available while editing */}
                    <Delete
                      onClick={() => setSavings((prev) => prev.filter((s) => s._uid !== saving._uid))}
                    />
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