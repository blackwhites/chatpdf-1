export function Send({ fill, size = 24, ...props }) {
  let realSize = size || 24;
  let realFill = fill || '#fff';
  return (
    <svg t="1682733485058" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2617" width={realSize} height={realSize}>
      <path fill={realFill} d="M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2-8.5 2.1-13.8 10.7-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-0.9 3.7-0.5 7.6 1.2 10.9 3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1 3.9-8 0.7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6 295.2-101.3c2.3-0.8 4.2-2.6 5-5 1.4-4.2-0.8-8.7-5-10.2L221.1 403 171 198.2l628 314.9-628.2 313.2z" p-id="2618">
      </path>
    </svg>
  )
}

export function PlusSVG({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.6" stroke={realFill} fill={realFill} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function SubSVG({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function MsgSVG({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="16" y1="12" x2="16" y2="12.01" />
    </svg>
  )
}

export function LeftSVG({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="5" y1="12" x2="9" y2="16" />
      <line x1="5" y1="12" x2="9" y2="8" />
    </svg>
  )
}

export function RightSVG({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={realSize} width={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="15" y1="16" x2="19" y2="12" />
      <line x1="15" y1="8" x2="19" y2="12" />
    </svg>
  )
}

export function SearchSVG({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
  )
}

export function Check({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width={realSize} height={realSize} fill={realFill} strokeWidth="1.5">
      <path d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z" />
    </svg>
  )
}

export function Download({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    </svg>
  )
}


export function Trash({ fill, size = 24 }) {
  let realSize = size || 14;
  let realFill = fill || '#fff';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={realSize} height={realSize} viewBox="0 0 24 24" strokeWidth="1.5" stroke={realFill} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  )
}