import React from "react";
import YearlyCard from "../components/yearly-card";
import type { YearlyCardData } from "../data";

type Distribution = {
  receivedIncome: number;
  shouldHave: number;
  actuallyHave: number;
  extra: number;
};

interface Props {
  distribution: Distribution;
}

export default function YearlyMoneyDistribution({ distribution }: Props) {
  const cards: YearlyCardData[] = [
    {
      id: "received",
      title: "Received Income",
      value: distribution.receivedIncome,
      description: "Total received income to date",
      color: "blue",
    },
    {
      id: "should-have",
      title: "Should Have",
      value: distribution.shouldHave,
      description: "Fixed savings + expense savings + current month budget",
      color: "orange",
    },
    {
      id: "actually-have",
      title: "Actually Have",
      value: distribution.actuallyHave,
      description: "Cash + accounts + investments + debt",
      color: "green",
    },
    {
      id: "extra",
      title: "Extra",
      value: distribution.extra,
      description: "Difference between should have and actually have",
      color: "purple",
    },
  ];

  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-[var(--surface-1)]">
      <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
        Yearly Money Distribution
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <YearlyCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
} 