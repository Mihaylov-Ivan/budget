"use client";

import React from "react";

interface EditBtnProps {
  onClick?: () => void;
}

export default function Edit({ onClick }: EditBtnProps) {
  return (
    <button
      onClick={onClick}
      title="Edit"
      className="p-2 rounded-md focus:outline-none border border-[var(--surface-4)] hover:bg-[var(--surface-4)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M5 21h14v-2H5v2zm14.7-14.3a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0L5 14.59V19h4.41l10.29-10.29z" />
      </svg>
    </button>
  );
} 