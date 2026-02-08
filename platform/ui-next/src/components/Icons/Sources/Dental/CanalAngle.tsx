import React from 'react';
import { IconProps } from '../../types';

export const CanalAngle = (props: IconProps) => {
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
          transform="translate(3, 3)"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9,1 C9,5 8,8 6.5,11 C5.5,13 4,15 3,17" />
          <line
            x1="6.5"
            y1="11"
            x2="11"
            y2="3"
          />
          <line
            x1="6.5"
            y1="11"
            x2="1.5"
            y2="17"
          />
          <path
            d="M8.2,7.8 C7.2,8.2 6.2,9 5.5,10"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};
