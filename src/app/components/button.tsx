import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({ label, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`p-2 rounded-lg border border-[var(--surface-4)] hover:bg-[var(--surface-4)] transition-colors ${className}`.trim()}
    >
      {label}
    </button>
  );
} 