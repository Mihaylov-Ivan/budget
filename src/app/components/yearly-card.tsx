import React from "react";
import { YearlyCardData } from "../data";

const textColors = {
  blue: "var(--blue)",
  orange: "var(--orange)",
  green: "var(--green)",
  purple: "var(--purple)"
} as const;

export default function YearlyCard({ title, value, description, color }: YearlyCardData) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="bg-[var(--surface-2)] rounded-lg p-6 flex flex-col gap-2 h-full">
      <h3 className="font-semibold" style={{ color: textColors[color] }}>{title}</h3>
      <p className="text-3xl font-bold" style={{ color: textColors[color] }}>{formatter.format(value)}</p>
      <span className="text-sm text-[var(--on-surface-2)]">{description}</span>
    </div >
  );
} 