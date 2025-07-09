"use client";

import React from "react";
import SubpageSelectorBtn from "./subpage-selector-btn";

export type SubpageKey = "Fixed Savings" | "Yearly Expenses" | "Monthly Budget" | "Overview";

interface SubpageSelectorProps {
  value: SubpageKey;
  onChange: (key: SubpageKey) => void;
}

const pages: SubpageKey[] = [
  "Fixed Savings",
  "Yearly Expenses",
  "Monthly Budget",
  "Overview",
];

export default function SubpageSelector({ value, onChange }: SubpageSelectorProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-2 bg-[var(--surface-1)] p-2 rounded-lg overflow-x-auto">
      {pages.map((page) => (
        <SubpageSelectorBtn
          key={page}
          label={page}
          active={value === page}
          onClick={() => onChange(page)}
        />
      ))}
    </div>
  );
} 