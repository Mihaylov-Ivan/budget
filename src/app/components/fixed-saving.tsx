import React from "react";
import { FixedSavings } from "../data";
import Delete from "./delete";

interface FixedSavingProps extends FixedSavings {
  editing: boolean;
}

export default function FixedSaving({
  name,
  total,
  saved,
  used,
  available,
  editing,
}: FixedSavingProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  const formatValue = (v: number | string) => {
    if (typeof v === "string") return v;
    return formatter.format(v);
  };

  const isCompleted = typeof total === "number" && typeof available === "number" && total > 0 && total === available;

  return (
    <tr
      className="border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]"
      style={isCompleted ? { backgroundColor: 'rgba(23, 163, 74, 0.15)' } : undefined}
    >
      <td className="py-4 px-3 whitespace-nowrap text-sm font-medium">
        {name}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatValue(total)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatValue(saved)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatValue(used)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatValue(available)}
      </td>
      {editing && (
        <td className="py-4 px-3 whitespace-nowrap text-sm flex gap-2">
          <Delete />
        </td>
      )}
    </tr>
  );
} 