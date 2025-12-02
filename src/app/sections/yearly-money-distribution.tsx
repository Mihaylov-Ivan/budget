import { useEffect, useMemo, useState } from "react";
import EditBtn from "../components/edit";
import YearlyCard from "../components/yearly-card";
import type { YearlyCardData } from "../data";
import { months } from "../data";

interface Props {
  budgetData: any; // Using any to avoid cross-file type circularity; structure is inferred at runtime
  selectedMonth: (typeof months)[number];
  setBudgetData?: (data: any) => void;
}

export default function YearlyMoneyDistribution({ budgetData, selectedMonth, setBudgetData }: Props) {
  const [editing, setEditing] = useState(false);
  const [overrideActuallyHave, setOverrideActuallyHave] = useState<number | null>(null);

  // Local state for the editable 'Actually Have' value
  const [actualEditValue, setActualEditValue] = useState<number>(
    budgetData.yearlyDistribution?.actuallyHave ?? 0
  );

  // Keep local editable value in sync when data changes and not editing
  useEffect(() => {
    if (!editing) {
      // Reset override after parent sends fresh data
      setOverrideActuallyHave(null);
    }
  }, [budgetData]);

  // Memoise heavy calculations to avoid unnecessary recomputations
  const { receivedIncome, shouldHave, actuallyHave, extra } = useMemo(() => {
    // Received income – sum of all income amounts for months before the selected one (Jun-to-May fiscal year)
    const selectedMonthIndex = months.indexOf(selectedMonth);

    const receivedIncomeCalc = (budgetData.monthlyBudgets ?? []).reduce((acc: number, b: any) => {
      const idx = months.indexOf(b.month);
      if (idx >= 0 && idx <= selectedMonthIndex) {
        const monthlyIncome = (b.income ?? []).reduce((sum: number, item: { amount: number; name: string }) => {
          // Filter out "Available Money" as it's not actual income
          if (item.name === 'Available Money') {
            return sum;
          }
          return sum + item.amount;
        }, 0);
        return acc + monthlyIncome;
      }
      return acc;
    }, 0);

    // Should have – fixed savings available + yearly expenses available + Available Money from monthly section
    const fixedSavingsAvailable = (budgetData.fixedSavings ?? []).reduce(
      (sum: number, s: any) => sum + (typeof s.available === "number" ? s.available : 0),
      0
    );

    const yearlyExpensesAvailable = (budgetData.yearlyExpenses ?? []).reduce(
      (sum: number, e: any) => sum + (typeof e.available === "number" ? e.available : 0),
      0
    );

    // Get "Available Money" from the selected month's income array
    const selectedMonthBudget = (budgetData.monthlyBudgets ?? []).find(
      (b: any) => b.month === selectedMonth
    );

    const availableMoneyFromSelectedMonth = (selectedMonthBudget?.income ?? []).find(
      (item: { name: string; amount: number }) => item.name === 'Available Money'
    )?.amount ?? 0;

    const shouldHaveCalc =
      fixedSavingsAvailable +
      yearlyExpensesAvailable +
      availableMoneyFromSelectedMonth;

    const actualVal = editing
      ? actualEditValue
      : overrideActuallyHave ?? (budgetData.yearlyDistribution?.actuallyHave ?? 0);

    return {
      receivedIncome: receivedIncomeCalc,
      shouldHave: shouldHaveCalc,
      actuallyHave: actualVal,
      extra: actualVal - shouldHaveCalc,
    } as const;
  }, [budgetData, selectedMonth, actualEditValue, editing, overrideActuallyHave]);

  const currentActuallyHave = editing ? actualEditValue : overrideActuallyHave ?? (budgetData.yearlyDistribution?.actuallyHave ?? 0);

  // Object representing the updated yearly distribution
  const updatedDistribution = {
    receivedIncome,
    shouldHave,
    actuallyHave: currentActuallyHave,
    extra: currentActuallyHave - shouldHave,
  } as const;

  const toggleEditing = () => {
    if (editing) {
      // Persist full yearlyDistribution object
      fetch('/api/budget/yearly-distribution', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearlyDistribution: { ...updatedDistribution, actuallyHave: actualEditValue } }),
      })
        .then(() => {
          // optimistic UI update
          setOverrideActuallyHave(actualEditValue);
          // Optionally refetch the entire budget data and lift to parent
          return fetch('/api/budget');
        })
        .then((res) => res?.json?.())
        .then((data) => {
          if (data && setBudgetData) setBudgetData(data);
        })
        .catch(console.error);
    }
    setEditing((p) => !p);
  };

  const cards: YearlyCardData[] = [
    {
      id: "received",
      title: "Received Income",
      value: receivedIncome,
      description: "Total received income to date",
      color: "blue",
    },
    {
      id: "should-have",
      title: "Should Have",
      value: shouldHave,
      description: "Fixed savings available + yearly expenses available + Available Money",
      color: "orange",
    },
    {
      id: "actually-have",
      title: "Actually Have",
      value: actuallyHave,
      description: "Cash + accounts + investments + debt",
      color: "green",
    },
    {
      id: "extra",
      title: "Extra",
      value: extra,
      description: "Difference between should have and actually have",
      color: "purple",
    },
  ];

  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          Yearly Money Distribution
        </h2>
        <EditBtn onClick={toggleEditing} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          if (card.id === 'actually-have' && editing) {
            return (
              <div key={card.id} className="bg-[var(--surface-2)] rounded-lg p-6 flex flex-col gap-2 h-full">
                <h3 className="font-semibold" style={{ color: 'var(--green)' }}>Actually Have</h3>
                <input
                  type="number"
                  step="0.01"
                  value={actualEditValue}
                  onChange={(e) => setActualEditValue(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  className="text-3xl font-bold bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
                />
                <span className="text-sm text-[var(--on-surface-2)]">Cash + accounts + investments + debt</span>
              </div>
            );
          }
          return <YearlyCard key={card.id} {...card} />;
        })}
      </div>
    </section>
  );
} 