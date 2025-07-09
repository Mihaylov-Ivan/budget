"use client";

import React from "react";
import { yearlyExpenses } from "../data";
import Add from "../components/add";
import YearlyExpenseRow from "../components/yearly-expense";

export default function YearlyExpenses() {
  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          Yearly Expense Savings
        </h2>
        <Add label="Add Yearly Expense" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--surface-3)] text-left">
          <thead className="bg-[var(--surface-2)]border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]">
            <tr>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Expense
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
                Used
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Available
              </th>
              <th className="py-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--gray)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--surface-1)]">
            {yearlyExpenses.map((expense) => (
              <YearlyExpenseRow key={expense.name} {...expense} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 