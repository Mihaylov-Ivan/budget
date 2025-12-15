import React from "react";

interface OverviewCardProps {
  title: string;
  value: number;
}

export default function OverviewCard({ title, value }: OverviewCardProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="border border-[var(--surface-3)] bg-[var(--surface-1)] rounded-lg p-6 flex flex-col gap-4 min-h-[140px]">
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-[var(--on-surface-2)]">{title}</h4>
      </div>
      <p className="text-2xl font-bold text-[var(--on-surface-0)]">{formatter.format(value)}</p>
    </div>
  );
} 