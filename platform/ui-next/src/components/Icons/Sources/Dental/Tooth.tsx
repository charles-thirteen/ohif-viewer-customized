import React from 'react';
import { IconProps } from '../../types';

export const Tooth = (props: IconProps) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
        ></rect>
        <g
          transform="translate(5, 2)"
          stroke="currentColor"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M7,0 C8.8,0 10.2,0.6 11.2,1.5 C12.8,2.9 13.4,4.8 13.2,7 C13,8.8 12.4,10.2 12,12 C11.6,13.8 11.4,15.4 11,17 C10.7,18.2 10.2,19.2 9.5,19.6 C8.6,20.1 7.8,19.4 7.4,18 C7,16.6 6.8,14.8 7,13.2 C7.1,12.2 6.9,11.8 6.5,11.8 C6.1,11.8 5.9,12.2 6,13.2 C6.2,14.8 6,16.6 5.6,18 C5.2,19.4 4.4,20.1 3.5,19.6 C2.8,19.2 2.3,18.2 2,17 C1.6,15.4 1.4,13.8 1,12 C0.6,10.2 0,8.8 -0.2,7 C-0.4,4.8 0.2,2.9 1.8,1.5 C2.8,0.6 4.2,0 6,0 L7,0 Z" />
        </g>
      </g>
    </svg>
  );
};
