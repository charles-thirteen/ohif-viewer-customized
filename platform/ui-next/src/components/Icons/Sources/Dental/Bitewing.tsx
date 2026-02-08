import React from 'react';
import { IconProps } from '../../types';

export const Bitewing = (props: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
        ></rect>
        <g
          transform="translate(2, 4)"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="0.5"
            y="0.5"
            width="19"
            height="15"
            rx="1.5"
          />
          <rect
            x="8"
            y="6"
            width="4"
            height="4"
            rx="0.5"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M3,6.5 L3,2.5 C3,2 3.5,1.5 4,2 L5,3 L5,2 C5,1.5 5.5,1.5 6,2 L6,3.5 L7,2.5 C7,2 7.5,1.5 8,2 L8,6.5"
            opacity="0.5"
          />
          <path
            d="M12,6.5 L12,2.5 C12,2 12.5,1.5 13,2 L13,3.5 L14,2.5 C14,2 14.5,1.5 15,2 L15,3 L16,2 C16,1.5 16.5,2 17,2.5 L17,6.5"
            opacity="0.5"
          />
          <path
            d="M3,9.5 L3,13 C3,13.5 3.5,14 4,13.5 L5,12.5 L5,13.5 C5,14 5.5,14 6,13.5 L6,12 L7,13 C7,13.5 7.5,14 8,13.5 L8,9.5"
            opacity="0.5"
          />
          <path
            d="M12,9.5 L12,13 C12,13.5 12.5,14 13,13.5 L13,12 L14,13 C14,13.5 14.5,14 15,13.5 L15,12.5 L16,13.5 C16,14 16.5,13.5 17,13 L17,9.5"
            opacity="0.5"
          />
        </g>
      </g>
    </svg>
  );
};
