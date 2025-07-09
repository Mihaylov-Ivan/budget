"use client";

import React, { useState } from "react";
import SubpageSelector, { SubpageKey } from "../components/subpage-selector";
import FixedSavings from "./fixed-savings";
import YearlyExpenses from "./yearly-expenses";
import MonthlyBudget from "./monthly-budget";

export default function Subpages() {
  const [active, setActive] = useState<SubpageKey>("Fixed Savings");

  return (
    <section className="flex flex-col gap-6 mt-8">
      {/* Selector */}
      <SubpageSelector value={active} onChange={setActive} />

      {/* Content */}
      {active === "Fixed Savings" && <FixedSavings />}
      {active === "Yearly Expenses" && <YearlyExpenses />}
      {active === "Monthly Budget" && <MonthlyBudget />}
      {active === "Overview" && (
        <div className="border border-dashed border-[var(--surface-3)] rounded-lg p-8 text-center text-[var(--gray)]">
          Overview section coming soon…
        </div>
      )}
    </section>
  );
} 