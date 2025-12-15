import React from "react";
import { YearlyExpenses } from "../data";
import Delete from "./delete";
import Button from "./button";

interface YearlyExpenseProps extends YearlyExpenses {
  editing: boolean;
}

export default function YearlyExpense({
  name,
  startMonth,
  total,
  totalShouldBe,
  monthlySaving,
  saved,
  missed,
  used,
  available,
  editing,
}: YearlyExpenseProps) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  const formatNum = (val: number) => currency.format(val);

  const isCompleted = typeof total === "number" && typeof saved === "number" && total > 0 && total === saved;

  return (
    <tr
      className="border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]"
      style={isCompleted ? { backgroundColor: 'rgba(23, 163, 74, 0.15)' } : undefined}
    >
      <td className="py-4 px-3 whitespace-nowrap text-sm font-medium">
        {name}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {startMonth}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(total)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {totalShouldBe}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(monthlySaving)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(saved)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(missed)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(used)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(available)}
      </td>
      {editing && (
        <td className="py-4 px-3 whitespace-nowrap text-sm flex gap-2">
          <Button label="Saved" />
          <Button label="Missed" />
          <Delete />
        </td>
      )}
    </tr>
  );
} 