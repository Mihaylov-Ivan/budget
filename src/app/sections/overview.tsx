import React from "react";
import OverviewCard from "../components/overview-card";
import { fixedSavings, monthlyBudget } from "../data";

function sum(items: { amount: number }[]) {
  return items.reduce((s, i) => s + i.amount, 0);
}

export default function Overview() {
  // Fixed savings total = sum of available
  const totalFixed = fixedSavings.reduce((s, f) => s + (typeof f.available === "number" ? f.available : 0), 0);

  const totalIncome = sum(monthlyBudget.income);

  const totalEssentials = [
    ...monthlyBudget.essentials.monthly,
    ...monthlyBudget.essentials.weekly,
  ].reduce((s, i) => s + i.amount, 0);
  const totalLuxury = [
    ...monthlyBudget.luxury.monthly,
    ...monthlyBudget.luxury.weekly,
  ].reduce((s, i) => s + i.amount, 0);
  const totalExpenses = totalEssentials + totalLuxury;

  const totalInvestments = monthlyBudget.investments.monthly.reduce((s, i) => s + i.amount, 0);

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