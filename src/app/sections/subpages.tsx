"use client";

import React, { useEffect, useState } from "react";
import SubpageSelector, { SubpageKey } from "../components/subpage-selector";
import FixedSavings from "./fixed-savings";
import YearlyExpenses from "./yearly-expenses";
import MonthlyBudget from "./monthly-budget";
import Overview from "./overview";
import type { FixedSavings as FixedSavingType, YearlyExpenses as YearlyExpenseType } from "../data";

interface Props {
  fixedSavings: FixedSavingType[];
  yearlyExpenses: YearlyExpenseType[];
  monthlyBudget: any;
  month: string;
  budgetData?: any;
}

export default function Subpages({ fixedSavings, yearlyExpenses, monthlyBudget, month, budgetData }: Props) {
  const [active, setActive] = useState<SubpageKey>("Fixed Savings");
  const [yearlyExpensesState, setYearlyExpensesState] = useState(yearlyExpenses);

  // Keep budgetData in sync with yearlyExpensesState
  const updatedBudgetData = { ...budgetData, yearlyExpenses: yearlyExpensesState };

  return (
    <section className="flex flex-col gap-4">
      {/* Selector */}
      <SubpageSelector value={active} onChange={setActive} />

      {/* Content */}
      {active === "Fixed Savings" && <FixedSavings data={fixedSavings} />}
      {active === "Yearly Expenses" && (
        <YearlyExpenses data={yearlyExpensesState} setData={setYearlyExpensesState} />
      )}
      {active === "Monthly Budget" && (
        <MonthlyBudget key={month} budget={monthlyBudget} month={month} budgetData={updatedBudgetData} />
      )}
      {active === "Overview" && <Overview savings={fixedSavings} budget={monthlyBudget} />}
    </section>
  );
} 