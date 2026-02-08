import React from 'react';
import { IconProps } from '../../types';

export const CrownWidth = (props: IconProps) => {
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
          transform="translate(3, 2)"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3,8 C2.5,5.5 3,3 4.5,1.5 C5.5,0.5 7,0 9,0 C11,0 12.5,0.5 13.5,1.5 C15,3 15.5,5.5 15,8" />
          <line
            x1="3"
            y1="8"
            x2="15"
            y2="8"
            strokeDasharray="1.5,1"
            opacity="0.6"
          />
          <path
            d="M5,8 C4.5,11 4.5,14 5.5,17 M13,8 C13.5,11 13.5,14 12.5,17"
            opacity="0.4"
          />
          <line
            x1="3"
            y1="4"
            x2="15"
            y2="4"
            strokeDasharray="2,1.5"
          />
          <polyline points="5 2.5 3 4 5 5.5" />
          <polyline points="13 2.5 15 4 13 5.5" />
          <line
            x1="3"
            y1="2.5"
            x2="3"
            y2="5.5"
          />
          <line
            x1="15"
            y1="2.5"
            x2="15"
            y2="5.5"
          />
        </g>
      </g>
    </svg>
  );
};
