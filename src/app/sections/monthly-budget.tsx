"use client";

import React from "react";
import MonthlyExpenseIncome from "./monthly-expense-income";
import MonthlyExpenseEssentials from "./monthly-expense-essentials";
import MonthlyExpenseLuxury from "./monthly-expense-luxury";
import MonthlyExpenseInvestments from "./monthly-expense-investments";

export default function MonthlyBudget() {
  return (
    <section className="flex flex-col gap-6">
      <MonthlyExpenseIncome />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpenseEssentials />
        <MonthlyExpenseLuxury />
      </div>
      <MonthlyExpenseInvestments />
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </div> */}
    </section>
  );
} 