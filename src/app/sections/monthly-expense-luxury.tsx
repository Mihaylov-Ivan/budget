"use client";

import React, { useState, useEffect } from "react";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";
import { useAmounts } from "../store/useAmounts";
import { YearlyExpenses as YearlyExpenseType } from "../data";
// Generate a stable unique id for list items
const genUid = () => Math.random().toString(36).slice(2) + Date.now();

function Block({ title = "", items }: { title?: string; items: { name: string; amount: number }[] }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h4
        className={`font-medium text-[var(--gray)] ${title === 'Weekly' ? 'text-lg' : 'text-sm'}`}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <BudgetItem
            key={item.name}
            name={item.name}
            amount={item.amount}
            color="purple"
          />
        ))}
      </div>
    </div>
  );
}

type Item = { _uid: string; name: string; amount: number; shouldBe?: number };
type Section = { id: string; items: Item[] };

interface Props {
  luxury: {
    percentage?: number;
    monthly: Section[];
    weekly: Item[];
  };
  month: string;
  daysInMonth: number;
  budgetData?: any; // Add budgetData to access income and essentials
}

export default function MonthlyExpenseLuxury({ luxury, month, daysInMonth, budgetData }: Props) {
  const [editing, setEditing] = useState(false);
  // Attach a stable _uid to each row for reliable keying
  const attachUidToSections = (sections: Section[]) =>
    sections.map((sec) => ({
      ...sec,
      items: sec.items.map((it) => ({ ...it, _uid: genUid() })),
    }));

  const attachUidToItems = (arr: any[]) => arr.map((it: any) => ({ ...it, _uid: genUid() }));

  const [monthlySections, setMonthlySections] = useState<Section[]>(attachUidToSections(JSON.parse(JSON.stringify(luxury.monthly))));
  const [weekly, setWeekly] = useState<Item[]>(attachUidToItems(JSON.parse(JSON.stringify(luxury.weekly))));
  const [percentage, setPercentage] = useState(luxury.percentage ?? 80); // Use percentage from data if provided
  const { availableMoney, essentialsTotal } = useAmounts();

  // Handler to add a new luxury item to all subsections
  const handleAddLuxury = () => {
    if (!editing) setEditing(true);

    // Add to all monthly sections
    setMonthlySections((prev) => {
      const clone: Section[] = JSON.parse(JSON.stringify(prev));
      clone.forEach((section) => {
        section.items.push({ _uid: genUid(), name: "", amount: 0 });
      });
      return clone;
    });

    // Add to weekly section
    setWeekly((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.push({ _uid: genUid(), name: "", amount: 0 });
      return clone;
    });
  };

  // --- Helper to map a savings item name to a yearly expense name ---
  const mapSavingsToYearly = (name: string) => {
    // Remove the trailing " Savings" and anything that comes after
    let base = name.replace(/\s*Savings.*$/i, "").trim();
    // Remove trailing commas if any
    base = base.replace(/,$/, "");
    return base;
  };

  // Calculate total: (sum of monthly) + (sum of weekly / 7 * days in month)
  const monthlyTotal = monthlySections.flatMap((s) => s.items).reduce((s, i) => s + i.amount, 0);
  const weeklyTotal = weekly.reduce((s, i) => s + i.amount, 0);
  const weeklyAdjusted = (weeklyTotal / 7) * daysInMonth;
  const total = monthlyTotal + weeklyAdjusted;

  const availableForLuxury = (availableMoney - essentialsTotal) * (percentage / 100);
  const unassigned = availableForLuxury - total;

  // Populate `shouldBe` for savings items based on yearly expenses monthlySaving and available money percentages
  useEffect(() => {
    setMonthlySections((prev) => {
      const clone: Section[] = JSON.parse(JSON.stringify(prev));
      const savingsSection = clone.find((s) => s.id === "savings");
      if (savingsSection) {
        savingsSection.items = savingsSection.items.map((it) => {
          // Calculate shouldBe based on percentage values in brackets at the end of field names
          const percentageMatch = it.name.match(/\((\d+(?:\.\d+)?)%\)$/);
          if (percentageMatch) {
            const percentageValue = parseFloat(percentageMatch[1]) / 100;
            return { ...it, shouldBe: availableForLuxury * percentageValue };
          }

          // Fall back to yearly expenses logic for other savings items
          if (budgetData?.yearlyExpenses) {
            const yearlyName = mapSavingsToYearly(it.name);
            const match: YearlyExpenseType | undefined = budgetData.yearlyExpenses.find(
              (y: any) => y.name === yearlyName
            );
            if (match) {
              return { ...it, shouldBe: match.monthlySaving };
            }
          }
          return it;
        });
      }
      return clone;
    });
  }, [availableForLuxury, budgetData]);

  const sanitizeData = () => {
    const sanitizedMonthly = monthlySections.map((sec) => ({
      ...sec,
      items: sec.items.filter((it) => it.name.trim() !== ""),
    }));
    const sanitizedWeekly = weekly.filter((it) => it.name.trim() !== "");
    return { sanitizedMonthly, sanitizedWeekly };
  };

  const saveChanges = () => {
    const { sanitizedMonthly, sanitizedWeekly } = sanitizeData();
    setMonthlySections(sanitizedMonthly);
    setWeekly(sanitizedWeekly);

    const payload = { percentage, monthly: sanitizedMonthly, weekly: sanitizedWeekly };
    fetch('/api/budget/monthly-budgets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'luxury', selectedMonth: month, data: payload })
    })
      .then(() => {
        // Refresh the budget data to reflect changes across all months
        return fetch('/api/budget');
      })
      .then((res) => res?.json?.())
      .catch(console.error);
  };

  const toggleEditing = () => {
    if (editing) saveChanges();
    setEditing((p) => !p);
  };

  const handleMonthlyItemChange = (
    secIdx: number,
    itemIdx: number,
    field: "name" | "amount" | "shouldBe",
    value: string
  ) => {
    setMonthlySections((prev) => {
      const copy = [...prev];
      const item = {
        ...copy[secIdx].items[itemIdx],
        [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value),
      };
      copy[secIdx].items[itemIdx] = item;
      return copy;
    });
  };

  const renderEditRows = (
    items: Item[],
    onChange: (idx: number, field: "name" | "amount", val: string) => void,
    onDelete: (item: Item) => void
  ) =>
    items.map((it, idx) => (
      <div key={it._uid} className="flex gap-2 items-center w-full">
        <input
          type="text"
          value={it.name}
          onChange={(e) => onChange(idx, "name", e.target.value)}
          className="flex-1 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
        />
        <input
          type="number"
          step="0.01"
          value={it.amount}
          onChange={(e) => onChange(idx, "amount", e.target.value)}
          className="w-24 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
        />
        <DeleteBtn onClick={() => onDelete(it)} />
      </div>
    ));

  const renderSavingsView = (items: Item[]) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="px-4 flex items-center text-sm font-medium text-[var(--gray)] mb-1">
        <span className="flex-1">Name</span>
        <span className="w-20 text-right">Amount</span>
        <span className="w-20 text-right">Should be</span>
      </div>
      {items.map((it, idx) => (
        <div
          key={idx}
          className="bg-[var(--surface-2)] text-[var(--purple)] rounded-lg px-4 py-2 flex items-center"
        >
          <span className="flex-1">{it.name}</span>
          <span className="w-20 text-right">{it.amount.toFixed(2)}</span>
          <span className="w-20 text-right">{(it.shouldBe ?? 0).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );

  const renderSavingsEditRows = (
    items: Item[],
    onChange: (
      idx: number,
      field: "name" | "amount" | "shouldBe",
      val: string
    ) => void,
    onDelete: (item: Item) => void
  ) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="px-4 flex items-center text-sm font-medium text-[var(--gray)] mb-1">
        <span className="flex-1">Name</span>
        <span className="w-20 text-right">Amount</span>
        <span className="w-20 text-right">Should be</span>
        <span className="w-8" />
      </div>
      {items.map((it, idx) => (
        <div key={it._uid} className="flex items-center gap-2">
          <input
            className="flex-1 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1"
            type="text"
            value={it.name}
            onChange={(e) => onChange(idx, "name", e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            value={it.amount}
            onChange={(e) => onChange(idx, "amount", e.target.value)}
            className="w-20 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
          />
          <span className="w-20 text-right">{(it.shouldBe ?? 0).toFixed(2)}</span>
          <DeleteBtn onClick={() => onDelete(it)} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Luxury
        </h3>
        <div className="flex gap-2">
          {!editing && <Add label="Add Luxury Item" onClick={handleAddLuxury} />}
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      {/* Percentage and Available rows */}
      <div className="flex items-center gap-2">
        <span className="flex-1 font-medium text-[var(--purple)]">Percentage</span>
        {editing ? (
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={percentage}
            onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
            className="w-24 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
          />
        ) : (
          <span className="w-24 text-right text-[var(--purple)]">{percentage.toFixed(2)}</span>
        )}
        <span className="text-[var(--purple)]">%</span>
      </div>

      <BudgetItem name="Available" amount={availableForLuxury} color="purple" highlight />
      <BudgetItem name="Unassigned" amount={unassigned} color="purple" warning={unassigned < 0} highlight />
      <BudgetItem name="Total" amount={total} color="purple" highlight />
      <div className="flex flex-col gap-2">
        {editing ? (
          <>
            <h4 className="text-lg font-medium text-[var(--gray)]">Monthly</h4>
            <div className="flex flex-col gap-1">
              {monthlySections.map((sec, sIdx) => (
                <div key={sec.id} className="flex flex-col gap-2 w-full">
                  {sec.id === 'savings'
                    ? renderSavingsEditRows(
                      sec.items,
                      (idx, field, val) => handleMonthlyItemChange(sIdx, idx, field, val),
                      (item) =>
                        setMonthlySections((prev) => {
                          const copy = [...prev];
                          copy[sIdx].items = copy[sIdx].items.filter((i) => i._uid !== item._uid);
                          return copy;
                        })
                    )
                    : renderEditRows(
                      sec.items,
                      (idx, field, val) => handleMonthlyItemChange(sIdx, idx, field, val),
                      (item) =>
                        setMonthlySections((prev) => {
                          const copy = [...prev];
                          copy[sIdx].items = copy[sIdx].items.filter((i) => i._uid !== item._uid);
                          return copy;
                        })
                    )}
                  {sIdx !== monthlySections.length - 1 && (
                    <hr className="border-dashed border-[var(--surface-3)]" />
                  )}
                </div>
              ))}
            </div>
            <h4 className="text-lg font-medium text-[var(--gray)]">Weekly</h4>
            {renderEditRows(
              weekly,
              (idx, field, val) =>
                setWeekly((prev) => {
                  const copy = [...prev];
                  copy[idx] = {
                    ...copy[idx],
                    [field]: field === 'name' ? val : val === '' ? 0 : parseFloat(val),
                  };
                  return copy;
                }),
              (item) => setWeekly((prev) => prev.filter((i) => i._uid !== item._uid))
            )}
          </>
        ) : (
          <>
            <h4 className="text-lg font-medium text-[var(--gray)]">Monthly</h4>
            <div className="flex flex-col gap-1">
              {monthlySections.map((sec, idx) => (
                <div key={sec.id} className="w-full">
                  {sec.id === 'savings' ? (
                    renderSavingsView(sec.items)
                  ) : (
                    <Block title="" items={sec.items} />
                  )}
                  {idx !== monthlySections.length - 1 && (
                    <hr className="border-dashed border-[var(--surface-3)] my-2" />
                  )}
                </div>
              ))}
            </div>
            <Block title="Weekly" items={weekly} />
          </>
        )}
      </div>
    </div>
  );
} 