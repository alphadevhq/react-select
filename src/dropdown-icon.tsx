import React from 'react';

const DropdownIcon = ({ size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M26 11 16 21 6 11"
      />
    </svg>
  );
};

export default DropdownIcon;
