export default function Flower({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M40 108 C40 78 28 70 34 48" />
      <path d="M34 48 C22 40 18 26 30 22 C36 20 40 28 40 34 C40 26 48 16 58 20 C68 24 64 40 50 46 C44 48 38 48 34 48Z" />
      <circle cx="40" cy="32" r="3" />
      <path d="M46 70 C58 60 70 62 66 78" />
    </svg>
  );
}
