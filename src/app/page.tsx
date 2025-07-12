'use client';

import { useEffect, useState } from "react";
import Dropdown from "./components/dropdown";
import {
  monthlyBudget as monthlyBudgetSample,
  months,
  yearlyDistribution as yearlyDistributionSample,
  type FixedSavings,
  type YearlyExpenses,
} from "./data";
import Subpages from "./sections/subpages";
import YearlyMoneyDistribution from "./sections/yearly-money-distribution";

// ------------------
// Construct BudgetData type using the sample objects & types declared in data.ts
// ------------------
type YearlyDistribution = typeof yearlyDistributionSample;
type MonthlyBudget = typeof monthlyBudgetSample;

// Complete Budget document shape returned by the API
export type BudgetData = {
  yearlyDistribution: YearlyDistribution;
  fixedSavings: FixedSavings[];
  yearlyExpenses: YearlyExpenses[];
  monthlyBudgets: Array<MonthlyBudget & { month: (typeof months)[number] }>;
};

export default function Home() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  // Selected month handling
  const defaultMonth = months[new Date().getMonth()] ?? months[0];
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);

  useEffect(() => {
    const fetchBudgetData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL!}/api/budget`);
      const data = await response.json();
      setBudgetData(data);
      console.log(data);
    };
    fetchBudgetData();

  }, [selectedMonth]);

  if (!budgetData) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col gap-6">
        <p>Loading...</p>
      </div>
    );
  }

  const monthlyBudget = budgetData.monthlyBudgets?.find((b: any) => b.month === selectedMonth);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Personal Budget Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Current Month:</span>
          <Dropdown value={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </header>

      {/* Sections */}
      <YearlyMoneyDistribution distribution={budgetData.yearlyDistribution} />
      {monthlyBudget && (
        <Subpages
          fixedSavings={budgetData.fixedSavings}
          yearlyExpenses={budgetData.yearlyExpenses}
          monthlyBudget={monthlyBudget}
          month={selectedMonth}
        />
      )}
    </div>
  );
}
