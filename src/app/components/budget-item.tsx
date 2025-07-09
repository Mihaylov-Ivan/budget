import React from "react";

interface BudgetItemProps {
  name: string;
  amount: number;
  color: "green" | "blue" | "purple";
  highlight?: boolean;
}

const textColors = {
  green: "var(--green)",
  blue: "var(--blue)",
  purple: "var(--purple)",
} as const;

export default function BudgetItem({ name, amount, color, highlight = false }: BudgetItemProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const bgClass = highlight ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)]";

  return (
    <div className={`${bgClass} rounded-md px-4 py-2 flex items-center justify-between ${highlight ? "font-semibold" : ""}`}
      style={{ color: `var(--${color})` }}>
      <span style={{ color: `var(--${color})` }}>{name}</span>
      <span style={{ color: `var(--${color})` }}>{formatter.format(amount)}</span>
    </div>
  );
} 