import React from 'react';
import { IconProps } from '../../types';

export const DentalThemeToggle = (props: IconProps) => {
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
          <path d="M7,1 C8.2,1 9,1.5 9.4,2.5 C9.7,3.5 9.5,4.8 9,6.5 C8.7,7.8 8.5,8.8 8.3,9.5 C8.2,10 8,10.2 7.7,10.2 C7.4,10.2 7.3,9.8 7.2,9.2 C7.1,8.5 7.1,8 7.2,7.5 C7.2,7.2 7,7.2 6.8,7.5 C6.9,8 6.9,8.5 6.8,9.2 C6.7,9.8 6.6,10.2 6.3,10.2 C6,10.2 5.8,10 5.7,9.5 C5.5,8.8 5.3,7.8 5,6.5 C4.5,4.8 4.3,3.5 4.6,2.5 C5,1.5 5.8,1 7,1 Z" />
          <line
            x1="9"
            y1="12"
            x2="9"
            y2="19"
            opacity="0.4"
          />
          <circle
            cx="5"
            cy="15.5"
            r="2"
          />
          <line
            x1="5"
            y1="12"
            x2="5"
            y2="12.8"
          />
          <line
            x1="7.5"
            y1="13"
            x2="6.9"
            y2="13.6"
          />
          <line
            x1="8"
            y1="15.5"
            x2="7.2"
            y2="15.5"
          />
          <line
            x1="7.5"
            y1="18"
            x2="6.9"
            y2="17.4"
          />
          <line
            x1="5"
            y1="19"
            x2="5"
            y2="18.2"
          />
          <line
            x1="2.5"
            y1="18"
            x2="3.1"
            y2="17.4"
          />
          <line
            x1="2"
            y1="15.5"
            x2="2.8"
            y2="15.5"
          />
          <line
            x1="2.5"
            y1="13"
            x2="3.1"
            y2="13.6"
          />
          <path d="M12,13 C12,15.8 13.5,18 15.5,18.5 C14.5,19.2 13.3,19.5 12,19.5 C9.5,19.5 7.5,17.5 7.5,15.5 C7.5,13.5 9,11.5 11.5,11.5 C12,11.5 12.5,11.6 13,11.8 C12.3,12.2 12,12.5 12,13 Z" />
        </g>
      </g>
    </svg>
  );
};
