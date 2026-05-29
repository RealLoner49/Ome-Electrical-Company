export function Icon({ children, className = '', size = 20, stroke = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const Icons = {
  cart: (props) => <Icon {...props}><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.8L21 7H7" /><circle cx="10" cy="19" r="1.5" /><circle cx="18" cy="19" r="1.5" /></Icon>,
  search: (props) => <Icon {...props}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></Icon>,
  sun: (props) => <Icon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.5 17.5l1.57 1.57M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.5 6.5l1.57-1.57" /></Icon>,
  moon: (props) => <Icon {...props}><path d="M20 14.5A7.5 7.5 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></Icon>,
  menu: (props) => <Icon {...props}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>,
  close: (props) => <Icon {...props}><path d="M6 6 18 18M18 6 6 18" /></Icon>,
  arrowRight: (props) => <Icon {...props}><path d="M5 12h14M13 5l7 7-7 7" /></Icon>,
  bolt: (props) => <Icon {...props}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></Icon>,
  shield: (props) => <Icon {...props}><path d="M12 3 5 6v6c0 4.2 2.7 7.5 7 9 4.3-1.5 7-4.8 7-9V6l-7-3Z" /><path d="m9.5 12 1.8 1.8L15 10" /></Icon>,
  truck: (props) => <Icon {...props}><path d="M3 7h11v8H3zM14 10h3l3 3v2h-6z" /><circle cx="8" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" /></Icon>,
  star: (props) => <Icon {...props}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.1L12 17.1 6.5 20l1-6.1L3 9.6l6.2-.9L12 3Z" /></Icon>,
  filter: (props) => <Icon {...props}><path d="M4 6h16M7 12h10M10 18h4" /></Icon>,
  bank: (props) => <Icon {...props}><path d="M3 10h18M5 10v8M10 10v8M15 10v8M20 10v8M2 20h20M12 3 2 8h20L12 3Z" /></Icon>,
  card: (props) => <Icon {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></Icon>,
  check: (props) => <Icon {...props}><path d="m5 13 4 4L19 7" /></Icon>,
  phone: (props) => <Icon {...props}><path d="M7 4h3l1 4-2 1.5a15 15 0 0 0 5.5 5.5L16 13l4 1v3a2 2 0 0 1-2 2A15 15 0 0 1 5 6a2 2 0 0 1 2-2Z" /></Icon>,
};
