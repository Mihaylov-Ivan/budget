import React from "react";
import YearlyCard from "../components/yearly-card";
import { yearlyCards } from "../data";

export default function YearlyMoneyDistribution() {
  return (
    <section className="border border-[var(--surface-3)] rounded-lg p-6 sm:p-8 flex flex-col gap-6 mt-8 bg-[var(--surface-1)]">
      <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
        Yearly Money Distribution
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {yearlyCards.map((card) => (
          <YearlyCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
} 