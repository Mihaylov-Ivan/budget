"use client";

import React from "react";
import MonthlyExpenseIncome from "./monthly-expense-income";
import MonthlyExpenseEssentials from "./monthly-expense-essentials";
import MonthlyExpenseLuxury from "./monthly-expense-luxury";
import MonthlyExpenseInvestments from "./monthly-expense-investments";

interface Props {
  budget: any;
  month: string;
  budgetData?: any; // Add budgetData to pass to income component
}

// Utility function to get days in a month
function getDaysInMonth(month: string): number {
  const monthMap: Record<string, number> = {
    "January": 31, "February": 28, "March": 31, "April": 30,
    "May": 31, "June": 30, "July": 31, "August": 31,
    "September": 30, "October": 31, "November": 30, "December": 31
  };
  return monthMap[month] || 30;
}

export default function MonthlyBudget({ budget, month, budgetData }: Props) {
  const daysInMonth = getDaysInMonth(month);

  return (
    <section className="flex flex-col gap-4">
      <MonthlyExpenseIncome income={budget.income} month={month} budgetData={budgetData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyExpenseEssentials essentials={budget.essentials} month={month} daysInMonth={daysInMonth} budgetData={budgetData} />
        <MonthlyExpenseLuxury luxury={budget.luxury} month={month} daysInMonth={daysInMonth} budgetData={budgetData} />
      </div>
      <MonthlyExpenseInvestments investments={budget.investments} month={month} daysInMonth={daysInMonth} />
    </section>
  );
} 