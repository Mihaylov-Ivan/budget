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
    if (!previousMonthBudget) return 0;

    // Find the nextMonth section in the previous month's essentials
    const nextMonthSection = previousMonthBudget.essentials?.monthly?.find(
      (s: any) => s.id === "nextMonth" || s.id === "nextMonth,"
    );
    let nextMonthSavings = 0;
    if (nextMonthSection?.items) {
      const nextMonthItem = nextMonthSection.items.find(
        (item: any) =>
          item.name === "Next Month Savings" ||
          item.name === "Next Month Savings,"
      );
      nextMonthSavings = nextMonthItem?.amount ?? 0;
    }

    // Calculate previous month's income
    const previousMonthIncome =
      previousMonthBudget.income?.reduce(
        (sum: number, item: Item) => sum + item.amount,
        0
      ) ?? 0;

    return previousMonthIncome + nextMonthSavings;
  }, [selectedMonth, budgetData]);
}
