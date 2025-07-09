"use client";

import React from "react";

interface SubpageSelectorBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SubpageSelectorBtn({
  label,
  active,
  onClick,
}: SubpageSelectorBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 w-full sm:flex-none px-4 py-2 text-sm sm:text-base font-medium transition-colors focus:outline-none border-b-3 border-[var(--surface-2)] hover:border-[var(--surface-3)]
        ${active ? "bg-[var(--surface-2)]" : "bg-[var(--surface-1)] text-[var(--on-surface-2)] opacity-75 hover:opacity-100"}`}
    >
      {label}
    </button>
  );
} 