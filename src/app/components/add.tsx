"use client";

import React from "react";

interface AddBtnProps {
  label: string;
  onClick?: () => void;
}

export default function Add({ label, onClick }: AddBtnProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-4 py-2 gap-2 rounded-lg transition-opacity border border-[var(--surface-3)] hover:bg-[var(--surface-3)]"
    >
      <div className="text-lg h-8 flex items-center justify-center mb-[2px]">+</div>
      <div className="text-sm h-8 flex items-center justify-center">{label}</div>
    </button>
  );
} 