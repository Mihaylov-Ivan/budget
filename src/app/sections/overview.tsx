import React from "react";
import OverviewCard from "../components/overview-card";
import type { FixedSavings as FixedSavingType, months } from "../data";

interface Props {
  savings: FixedSavingType[];
  budget: any;
  month: (typeof months)[number];
}

function sum(items: { amount: number }[]) {
  return items.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
}

// Utility function to get days in a month (same as in monthly-budget.tsx)
function getDaysInMonth(month: string): number {
  const monthMap: Record<string, number> = {
    "January": 31, "February": 28, "March": 31, "April": 30,
    "May": 31, "June": 30, "July": 31, "August": 31,
    "September": 30, "October": 31, "November": 30, "December": 31
  };
  return monthMap[month] || 30;
}

export default function Overview({ savings, budget, month }: Props) {
  const daysInMonth = getDaysInMonth(month);

  // Fixed savings total = sum of available
  const totalFixed = savings.reduce((s, f) => s + (typeof f.available === "number" ? f.available : 0), 0);

  // Total income excluding "Available Money" (which is not actual income)
  const totalIncome = (budget.income ?? [])
    .filter((item: { name: string; amount: number }) => item.name !== 'Available Money')
    .reduce((s: number, i: { amount: number }) => s + i.amount, 0);

  // Essentials total: monthly items (flattened from sections) + weekly items converted to monthly
  const essentialsMonthlyTotal = (budget.essentials?.monthly ?? [])
    .flatMap((section: { items: { amount: number }[] }) => section.items)
    .reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const essentialsWeeklyTotal = (budget.essentials?.weekly ?? [])
    .reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const essentialsWeeklyAdjusted = (essentialsWeeklyTotal / 7) * daysInMonth;
  const totalEssentials = essentialsMonthlyTotal + essentialsWeeklyAdjusted;

  // Luxury total: monthly items (flattened from sections) + weekly items converted to monthly
  const luxuryMonthlyTotal = (budget.luxury?.monthly ?? [])
    .flatMap((section: { items: { amount: number }[] }) => section.items)
    .reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const luxuryWeeklyTotal = (budget.luxury?.weekly ?? [])
    .reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const luxuryWeeklyAdjusted = (luxuryWeeklyTotal / 7) * daysInMonth;
  const totalLuxury = luxuryMonthlyTotal + luxuryWeeklyAdjusted;

  const totalExpenses = totalEssentials + totalLuxury;

  const totalInvestments = (budget.investments?.monthly ?? []).reduce((s: number, i: { amount: number }) => s + i.amount, 0);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <OverviewCard
        title="Total Fixed Savings"
        value={totalFixed}
      />
      <OverviewCard
        title="Monthly Income"
        value={totalIncome}
      />
      <OverviewCard
        title="Monthly Expenses"
        value={totalExpenses}
      />
      <OverviewCard
        title="Monthly Investments"
        value={totalInvestments}
      />
    </section>
  );
} 