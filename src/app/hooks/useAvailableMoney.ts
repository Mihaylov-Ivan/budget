import { useMemo } from "react";
import { months } from "../data";

interface Item {
  name: string;
  amount: number;
}

export function useAvailableMoney(
  selectedMonth: (typeof months)[number],
  budgetData: any
) {
  return useMemo(() => {
    if (!budgetData?.monthlyBudgets) return 0;

    const currentMonthIndex = months.indexOf(selectedMonth);
    const previousMonthIndex =
      currentMonthIndex === 0 ? months.length - 1 : currentMonthIndex - 1;
    const previousMonth = months[previousMonthIndex];

    const previousMonthBudget = budgetData.monthlyBudgets.find(
      (b: any) => b.month === previousMonth
    );
    if (!previousMonthBudget?.income) return 0;

    // Sum of all received income from previous month (exclude "Available Money")
    const previousMonthIncome =
      previousMonthBudget.income
        ?.filter((item: Item) => item.name !== "Available Money")
        .reduce((sum: number, item: Item) => sum + item.amount, 0) ?? 0;

    return previousMonthIncome;
  }, [selectedMonth, budgetData]);
}
