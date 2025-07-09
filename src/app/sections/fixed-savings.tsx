"use client";

import React from "react";
import Add from "../components/add";
import FixedExpense from "../components/fixed-expense";
import { fixedSavings } from "../data";

export default function FixedSavings() {
  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          Fixed Savings
        </h2>
        <Add label="Add Saving Goal" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--surface-3)] text-left">
          <thead className="bg-[var(--surface-2)]">
            <tr>
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
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--surface-1)]">
            {fixedSavings.map((saving) => (
              <FixedExpense key={saving.name} {...saving} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 