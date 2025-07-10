"use client";

import React, { useState } from "react";
import { monthlyBudget as initialBudget } from "../data";
import BudgetItem from "../components/budget-item";
import Add from "../components/add";
import EditBtn from "../components/edit";
import DeleteBtn from "../components/delete";

type Item = { name: string; amount: number; shouldBe?: number };
type Section = { id: string; items: Item[] };

function SectionBlock({ title = "", items }: { title?: string; items: Item[] }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h4 className={`font-medium text-[var(--gray)] ${title === 'Weekly' ? 'text-lg' : 'text-sm'}`}>{title}</h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <BudgetItem key={item.name} name={item.name} amount={item.amount} color="blue" />
        ))}
      </div>
    </div>
  );
}

export default function MonthlyExpenseEssentials() {
  const [editing, setEditing] = useState(false);
  const [monthlySections, setMonthlySections] = useState<Section[]>(
    initialBudget.essentials.monthly as unknown as Section[]
  );
  const [weekly, setWeekly] = useState<Item[]>(initialBudget.essentials.weekly as Item[]);

  const total = [
    ...monthlySections.flatMap((sec) => sec.items),
    ...weekly,
  ].reduce((s, i) => s + i.amount, 0);

  const toggleEditing = () => setEditing((p) => !p);

  const handleFieldChange = (
    arrSetter: React.Dispatch<React.SetStateAction<typeof weekly>>, // weekly setter
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    arrSetter((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value),
      };
      return copy;
    });
  };

  const handleMonthlyItemChange = (
    secIdx: number,
    itemIdx: number,
    field: "name" | "amount" | "shouldBe",
    value: string
  ) => {
    setMonthlySections((prev) => {
      const copy = [...prev];
      const item = { ...copy[secIdx].items[itemIdx], [field]: field === "name" ? value : value === "" ? 0 : parseFloat(value) };
      copy[secIdx].items[itemIdx] = item;
      return copy;
    });
  };

  const renderEditRows = (
    items: Item[],
    onChange: (idx: number, field: "name" | "amount", val: string) => void,
    onDelete: (idx: number) => void
  ) =>
    items.map((it, idx) => (
      <div key={idx} className="flex gap-2 items-center w-full">
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
        <DeleteBtn onClick={() => onDelete(idx)} />
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
        <div key={idx} className="bg-[var(--surface-2)] text-[var(--blue)] rounded-lg px-4 py-2 flex items-center">
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
    onDelete: (idx: number) => void
  ) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="px-4 flex items-center text-sm font-medium text-[var(--gray)] mb-1">
        <span className="flex-1">Name</span>
        <span className="w-20 text-right">Amount</span>
        <span className="w-20 text-right">Should be</span>
        <span className="w-8" />
      </div>
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-2">
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
          {/* <input
            type="number"
            step="0.01"
            value={it.shouldBe ?? 0}
            onChange={(e) => onChange(idx, "shouldBe", e.target.value)}
            className="w-20 bg-transparent border border-[var(--surface-4)] rounded px-2 py-1 text-right"
          /> */}
          <span className="w-20 text-right">0</span>
          <DeleteBtn onClick={() => onDelete(idx)} />
        </div>
      ))}
    </div>
  );

  const SECTION_TITLES: Record<string, string> = {
    nextMonth: "Next Month",
    expenses: "Expenses",
    savings: "Savings",
  };

  return (
    <div className="border border-[var(--surface-3)] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          Essentials
        </h3>
        <div className="flex gap-2">
          <Add label="Add Essential" />
          <EditBtn onClick={toggleEditing} />
        </div>
      </div>

      {/* Monthly and Weekly Blocks */}
      <BudgetItem name="Total" amount={total} color="blue" highlight />
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
                      (idx) =>
                        setMonthlySections((prev) => {
                          const copy = [...prev];
                          copy[sIdx].items = copy[sIdx].items.filter((_, i) => i !== idx);
                          return copy;
                        })
                    )
                    : renderEditRows(
                      sec.items,
                      (idx, field, val) => handleMonthlyItemChange(sIdx, idx, field, val),
                      (idx) =>
                        setMonthlySections((prev) => {
                          const copy = [...prev];
                          copy[sIdx].items = copy[sIdx].items.filter((_, i) => i !== idx);
                          return copy;
                        })
                    )}
                  {sIdx !== monthlySections.length - 1 && <hr className="border-dashed border-[var(--surface-3)]" />}
                </div>
              ))}
            </div>
            <h4 className="text-lg font-medium text-[var(--gray)]">Weekly</h4>
            {renderEditRows(
              weekly,
              (idx, field, val) => handleFieldChange(setWeekly, idx, field, val),
              (idx) => setWeekly((prev) => prev.filter((_, i) => i !== idx))
            )}
          </>
        ) : (
          <>
            <h4 className={`text-lg font-medium text-[var(--gray)]`}>Monthly</h4>
            <div className="flex flex-col gap-1">
              {monthlySections.map((sec, idx) => (
                <div key={sec.id} className="w-full">
                  {sec.id === 'savings' ? (
                    renderSavingsView(sec.items)
                  ) : (
                    <SectionBlock title="" items={sec.items} />
                  )}
                  {idx !== monthlySections.length - 1 && (
                    <hr className="border-dashed border-[var(--surface-3)] my-2" />
                  )}
                </div>
              ))}
            </div>
            <SectionBlock title="Weekly" items={weekly} />
          </>
        )}
      </div>
    </div>
  );
} 