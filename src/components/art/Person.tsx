/*
 * A student facing left, feet at (0,0), about 140 units tall.
 * Hooks: .leg-f / .leg-b swing from the hip, .arm raises the phone, .p-body bobs.
 */
export type Look = { skin: string; shirt: string; shirtDark: string; pants: string; bag: string; hair: "low" | "puff" | "cap" | "braids" };

export const LOOKS: Look[] = [
  { skin: "#8d5524", shirt: "#ff6b4a", shirtDark: "#d9472a", pants: "#26303d", bag: "#ffc700", hair: "low" },
  { skin: "#5c3a1e", shirt: "#3d7bff", shirtDark: "#2a5ad1", pants: "#1d2530", bag: "#f4f3ec", hair: "puff" },
  { skin: "#c68642", shirt: "#19b86a", shirtDark: "#0e8a4e", pants: "#2c2340", bag: "#0e1115", hair: "cap" },
  { skin: "#3d2412", shirt: "#b483ff", shirtDark: "#8a5ae0", pants: "#26303d", bag: "#ff6b4a", hair: "braids" },
];

function Hair({ kind }: { kind: Look["hair"] }) {
  switch (kind) {
    case "puff":
      return <circle cx={0} cy={-136} r={14} fill="#120b06" />;
    case "cap":
      return <path d="M-19 -126q1-19 19-19t17 15v4zM-19 -127h-12q0-5 6-6h6z" fill="#0e1115" />;
    case "braids":
      return (
        <g fill="#120b06">
          <path d="M-17 -124q0-20 17-20t17 20v-3q0 2-2 4l-1 26h-6l1-26q-8-6-26-1z" />
        </g>
      );
    default:
      return <path d="M-17 -126q0-18 17-18t17 18q-6-8-17-8t-17 8z" fill="#120b06" />;
  }
}

export default function Person({ look, className }: { look: Look; className: string }) {
  return (
    <g className={`person ${className}`}>
      <ellipse cx={0} cy={0} rx={22} ry={5} fill="#000" opacity={0.3} />
      <g className="p-body">
        <g className="leg-b">
          <rect x={-3} y={-54} width={12} height={52} rx={6} fill="#151a21" />
          <path d="M-6 -6h15a3 3 0 0 1 3 3v3h-21q0-6 3-6z" fill="#0e1115" />
        </g>
        <g className="leg-f">
          <rect x={-8} y={-54} width={12} height={52} rx={6} fill={look.pants} />
          <path d="M-14 -6h18v6h-20q0-6 2-6z" fill="#f4f3ec" />
        </g>
        <rect x={6} y={-104} width={20} height={42} rx={8} fill={look.bag} />
        <rect x={-17} y={-108} width={34} height={60} rx={15} fill={look.shirt} />
        <circle cx={0} cy={-124} r={17} fill={look.skin} />
        <circle cx={-10} cy={-126} r={2.2} fill="#0e1115" />
        <path d="M-15 -116q4 3 8 0" stroke="#0e1115" strokeWidth={2} fill="none" strokeLinecap="round" />
        <Hair kind={look.hair} />
        <g className="arm">
          <rect x={-5} y={-102} width={10} height={44} rx={5} fill={look.shirtDark} />
          <circle cx={0} cy={-58} r={6} fill={look.skin} />
          <rect x={-6} y={-60} width={12} height={18} rx={3} fill="#0e1115" />
          <rect x={-4} y={-58} width={8} height={12} rx={1.5} fill="#ffc700" opacity={0.9} />
        </g>
      </g>
    </g>
  );
}
