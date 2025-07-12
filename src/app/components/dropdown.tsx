"use client";

import React from "react";
import { months } from "../data";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: readonly string[];
}

export default function Dropdown({ value, onChange, options = months }: DropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-[var(--surface-3)] rounded-lg px-3 py-2 text-sm bg-[var(--surface-1)] focus:outline-none hover:bg-[var(--surface-3)]"
    >
      {options.map((month) => (
        <option key={month} value={month} className="bg-[var(--surface-1)]">
          {month}
        </option>
      ))}
    </select>
  );
} 