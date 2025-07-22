import React from "react";

interface SageIconProps {
  className?: string;
}

export function SageIcon({ className = "w-5 h-5" }: SageIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clear "S" icon matching the improved favicon */}
      <path
        d="M7 9c0-1.1 1.1-2 2-2h6c1.1 0 2 0.9 2 2s-0.9 2-2 2h-6c-1.1 0-2 0.9-2 2s0.9 2 2 2h6c1.1 0 2 0.9 2 2s-0.9 2-2 2h-6c-1.1 0-2-0.9-2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}