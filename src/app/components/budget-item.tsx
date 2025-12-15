import React from "react";

interface BudgetItemProps {
  name: string;
  amount: number;
  color: "green" | "blue" | "purple";
  warning?: boolean;
  highlight?: boolean;
}

const textColors = {
  green: "var(--green)",
  blue: "var(--blue)",
  purple: "var(--purple)",
} as const;

export default function BudgetItem({ name, amount, color, warning = false, highlight = false }: BudgetItemProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  const bgClass = highlight ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)]";

  return (
    <div className={`${bgClass} rounded-lg px-4 py-2 flex items-center justify-between ${highlight ? "font-semibold" : ""} ${warning ? "bg-red-500 !text-white" : ""}`}
      style={{ color: `var(--${color})` }}>
      <span>{name}</span>
      <span>{formatter.format(amount)}</span>
    </div>
  );
} 