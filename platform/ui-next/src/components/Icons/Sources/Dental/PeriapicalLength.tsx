import React from 'react';
import { IconProps } from '../../types';

export const PeriapicalLength = (props: IconProps) => {
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
          <path d="M5,0.5 C7.5,0.5 9,1.8 9.5,4 C9.8,5.5 9.5,7.5 9,10 C8.5,12.5 8.2,14 8,16 C7.9,17 7.4,17.5 7,17.5 C6.5,17.5 6.2,16.5 6,15.5 C5.8,14.5 5.8,13.5 6,12 C6,11.5 5.5,11.5 5,12 C4.5,13.5 4.2,14.5 4,15.5 C3.8,16.5 3.5,17.5 3,17.5 C2.6,17.5 2.1,17 2,16 C1.8,14 1.5,12.5 1,10 C0.5,7.5 0.2,5.5 0.5,4 C1,1.8 2.5,0.5 5,0.5 Z" />
          <line
            x1="12.5"
            y1="0.5"
            x2="12.5"
            y2="17.5"
            strokeDasharray="2,1.5"
          />
          <polyline points="11 2.5 12.5 0.5 14 2.5" />
          <polyline points="11 15.5 12.5 17.5 14 15.5" />
          <line
            x1="11"
            y1="0.5"
            x2="14"
            y2="0.5"
          />
          <line
            x1="11"
            y1="17.5"
            x2="14"
            y2="17.5"
          />
        </g>
      </g>
    </svg>
  );
};
