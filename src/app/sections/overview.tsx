import React from "react";
import OverviewCard from "../components/overview-card";
import type { FixedSavings as FixedSavingType } from "../data";

interface Props {
  savings: FixedSavingType[];
  budget: any;
}

function sum(items: { amount: number }[]) {
  return items.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
}

export default function Overview({ savings, budget }: Props) {
  // Fixed savings total = sum of available
  const totalFixed = savings.reduce((s, f) => s + (typeof f.available === "number" ? f.available : 0), 0);

  const totalIncome = sum(budget.income);

  const totalEssentials = [
    ...budget.essentials.monthly,
    ...budget.essentials.weekly,
  ].reduce((s, i) => s + i.amount, 0);
  const totalLuxury = [
    ...budget.luxury.monthly,
    ...budget.luxury.weekly,
  ].reduce((s, i) => s + i.amount, 0);
  const totalExpenses = totalEssentials + totalLuxury;

  const totalInvestments = budget.investments.monthly.reduce((s: number, i: { amount: number }) => s + i.amount, 0);

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