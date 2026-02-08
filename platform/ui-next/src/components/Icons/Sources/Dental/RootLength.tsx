import React from 'react';
import { IconProps } from '../../types';

export const RootLength = (props: IconProps) => {
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
          transform="translate(4, 2)"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M2,4 C1.5,2 2.5,0.5 5,0.5 C7.5,0.5 8.5,2 8,4"
            opacity="0.4"
          />
          <line
            x1="2"
            y1="4"
            x2="8"
            y2="4"
            strokeDasharray="1.5,1"
            opacity="0.6"
          />
          <path d="M2,4 C1.5,7 1.5,10 2,12.5 C2.5,15 3.5,17 5,18 C6.5,17 7.5,15 8,12.5 C8.5,10 8.5,7 8,4" />
          <line
            x1="13"
            y1="4"
            x2="13"
            y2="18"
            strokeDasharray="2,1.5"
          />
          <polyline points="11.5 6 13 4 14.5 6" />
          <polyline points="11.5 16 13 18 14.5 16" />
          <line
            x1="11.5"
            y1="4"
            x2="14.5"
            y2="4"
          />
          <line
            x1="11.5"
            y1="18"
            x2="14.5"
            y2="18"
          />
        </g>
      </g>
    </svg>
  );
};
