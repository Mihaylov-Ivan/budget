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
  const currentMonthIndex = new Date().getMonth(); // 0-11 (Jan = 0, Dec = 11)
  // Map current month to June-starting array: Jan=7, Feb=8, ..., May=11, Jun=0, Jul=1, ..., Dec=5
  const mappedIndex = currentMonthIndex >= 5 ? currentMonthIndex - 5 : currentMonthIndex + 7;
  const defaultMonth = months[mappedIndex] ?? months[0];
  const [selectedMonth, setSelectedMonth] = useState<(typeof months)[number]>(defaultMonth);

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
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex items-center justify-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning inner ring */}
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
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
      <YearlyMoneyDistribution budgetData={budgetData} selectedMonth={selectedMonth as (typeof months)[number]} />
      {monthlyBudget && (
        <Subpages
          fixedSavings={budgetData.fixedSavings}
          yearlyExpenses={budgetData.yearlyExpenses}
          monthlyBudget={monthlyBudget}
          month={selectedMonth}
          budgetData={budgetData}
        />
      )}
    </div>
  );
}
