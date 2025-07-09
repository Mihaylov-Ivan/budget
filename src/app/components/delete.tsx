"use client";

import React from "react";

interface DeleteBtnProps {
  onClick?: () => void;
}

export default function Delete({ onClick }: DeleteBtnProps) {
  return (
    <button
      onClick={onClick}
      title="Delete"
      className="p-2 rounded-md border border-[var(--surface-4)] hover:bg-[var(--surface-4)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
      </svg>
    </button>
  );
} 