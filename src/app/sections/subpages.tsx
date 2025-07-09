"use client";

import React, { useState } from "react";
import SubpageSelector, { SubpageKey } from "../components/subpage-selector";
import FixedSavings from "./fixed-savings";
import YearlyExpenses from "./yearly-expenses";
import MonthlyBudget from "./monthly-budget";
import Overview from "./overview";

export default function Subpages() {
  const [active, setActive] = useState<SubpageKey>("Fixed Savings");

  return (
    <section className="flex flex-col gap-4">
      {/* Selector */}
      <SubpageSelector value={active} onChange={setActive} />

      {/* Content */}
      {active === "Fixed Savings" && <FixedSavings />}
      {active === "Yearly Expenses" && <YearlyExpenses />}
      {active === "Monthly Budget" && <MonthlyBudget />}
      {active === "Overview" && <Overview />}
    </section>
  );
} 