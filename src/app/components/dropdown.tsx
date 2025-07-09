"use client";

import React, { useState } from "react";
import { months } from "../data";

interface DropdownProps {
  initial?: string;
}

export default function Dropdown({ initial }: DropdownProps) {
  const [selected, setSelected] = useState<string>(initial ?? months[new Date().getMonth()]);

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="border border-[var(--surface-3)] rounded-lg px-3 py-2 text-sm bg-[var(--surface-1)] focus:outline-none hover:bg-[var(--surface-3)]"
    >
      {months.map((month) => (
        <option key={month} value={month} className="bg-[var(--surface-1)]">
          {month}
        </option>
      ))}
    </select>
  );
} 