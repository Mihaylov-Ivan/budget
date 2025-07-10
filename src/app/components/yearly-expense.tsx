import React from "react";
import { YearlyExpenses } from "../data";
import Delete from "./delete";

interface YearlyExpenseProps extends YearlyExpenses {
  editing: boolean;
}

export default function YearlyExpense({
  name,
  total,
  totalShouldBe,
  monthlySaving,
  saved,
  missed, // not displayed but preserved for future
  used,
  available,
  editing,
}: YearlyExpenseProps) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const formatNum = (val: number) => currency.format(val);

  return (
    <tr className="border-b border-[var(--surface-3)] hover:bg-[var(--surface-3)]">
      <td className="py-4 px-3 whitespace-nowrap text-sm font-medium">
        {name}
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
        {formatNum(used)}
      </td>
      <td className="py-4 px-3 whitespace-nowrap text-sm">
        {formatNum(available)}
      </td>
      {editing && (
        <td className="py-4 px-3 whitespace-nowrap text-sm flex gap-2">
          <Delete />
        </td>
      )}
    </tr>
  );
} 