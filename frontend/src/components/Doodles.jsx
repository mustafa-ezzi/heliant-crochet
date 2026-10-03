export function ArrowDoodle({ className }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path
        d="M14 10 L56 30 L36 36 L46 62 L32 66 L22 40 L10 52 Z"
        fill="var(--peach)"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BoxDoodle({ className }) {
  return (
    <svg className={className} viewBox="0 0 88 72" fill="none" aria-hidden="true">
      <path d="M8 26 L30 14 L36 32 L14 42 Z" fill="var(--peach)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M80 26 L58 14 L52 32 L74 42 Z" fill="var(--peach)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M30 14 H58 L52 32 H36 Z" fill="var(--rose)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="18" y="36" width="52" height="28" rx="3" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2.4" />
      <path
        d="M44 46 C44 43 39 43 39 47 C39 51 44 56 44 56 C44 56 49 51 49 47 C49 43 44 43 44 46 Z"
        fill="var(--rose)"
        stroke="var(--ink)"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function NotebookDoodle({ className }) {
  return (
    <svg className={className} viewBox="0 0 68 80" fill="none" aria-hidden="true">
      <rect x="16" y="8" width="44" height="64" rx="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" />
      <path d="M16 14 H24 V66 H16" fill="var(--rose)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="20" cy="24" r="2" fill="var(--ink)" />
      <circle cx="20" cy="36" r="2" fill="var(--ink)" />
      <circle cx="20" cy="48" r="2" fill="var(--ink)" />
      <circle cx="20" cy="60" r="2" fill="var(--ink)" />
      <path d="M32 26 H52 M32 36 H52 M32 46 H46" stroke="var(--plum)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
