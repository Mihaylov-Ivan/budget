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
    const isFirstMonth = currentMonthIndex === 0;

    // For first month, get Available Money from the current month's income
    if (isFirstMonth) {
      const currentMonthBudget = budgetData.monthlyBudgets.find(
        (b: any) => b.month === selectedMonth
      );
      if (currentMonthBudget?.income) {
        const availableMoneyItem = currentMonthBudget.income.find(
          (item: any) => item.name === "Available Money"
        );
        if (availableMoneyItem) {
          return availableMoneyItem.amount;
        }
      }
      return 0;
    }

    // For other months, calculate from previous month's income + next month savings
    const previousMonthIndex = currentMonthIndex - 1;
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

    // Calculate previous month's income (excluding Available Money)
    const previousMonthIncome =
      previousMonthBudget.income
        ?.filter((item: Item) => item.name !== "Available Money")
        .reduce((sum: number, item: Item) => sum + item.amount, 0) ?? 0;

    return previousMonthIncome + nextMonthSavings;
  }, [selectedMonth, budgetData]);
}
