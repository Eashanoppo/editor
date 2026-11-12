import React from "react";

export function PythonLogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Original Python-inspired interlocking geometric emblem */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="7"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />
      <path
        d="M16 7C12.4 7 11 8.5 11 11V13.5H16V15H9.5C7.6 15 6.5 16.5 6.5 19C6.5 21.5 7.6 23 9.5 23H11.5V20.5C11.5 18.2 13 16.5 15.5 16.5H19.5C21.1 16.5 22.5 15.2 22.5 13.5V11C22.5 8.5 20.5 7 16 7Z"
        fill="#3776AB"
      />
      <circle cx="13.75" cy="10.25" r="1.15" fill="#FFFFFF" />
      <path
        d="M16 25C19.6 25 21 23.5 21 21V18.5H16V17H22.5C24.4 17 25.5 15.5 25.5 13C25.5 10.5 24.4 9 22.5 9H20.5V11.5C20.5 13.8 19 15.5 16.5 15.5H12.5C10.9 15.5 9.5 16.8 9.5 18.5V21C9.5 23.5 11.5 25 16 25Z"
        fill="#FFD343"
      />
      <circle cx="18.25" cy="21.75" r="1.15" fill="#243247" />
    </svg>
  );
}

