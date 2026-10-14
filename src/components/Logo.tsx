export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#ffc700" />
      <path d="M17 13h10v17l15-17h12L37 32l18 21H42L27 35v18H17z" fill="#0e1115" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="logo">
      <Mark />
      <span>konduct</span>
    </span>
  );
}
