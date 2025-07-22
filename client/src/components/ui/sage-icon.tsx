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
      {/* Custom "S" icon matching the favicon design */}
      <path
        d="M6 9c0-1.5 1.2-2.7 2.7-2.7h6.6c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7h-3.8v0.6h3.8c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7h-6.6c-1.5 0-2.7-1.2-2.7-2.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}