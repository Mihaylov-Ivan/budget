"use client";

import React from "react";
import MonthlyExpenseIncome from "./monthly-expense-income";
import MonthlyExpenseEssentials from "./monthly-expense-essentials";
import MonthlyExpenseLuxury from "./monthly-expense-luxury";
import MonthlyExpenseInvestments from "./monthly-expense-investments";

interface Props {
  budget: any;
  month: string;
}

export default function MonthlyBudget({ budget, month }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <MonthlyExpenseIncome income={budget.income} month={month} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyExpenseEssentials essentials={budget.essentials} month={month} />
        <MonthlyExpenseLuxury luxury={budget.luxury} month={month} />
      </div>
      <MonthlyExpenseInvestments investments={budget.investments} month={month} />
    </section>
  );
} 