const A = ["No change wahala", "Scan · Pay · Ride", "Driver paid in seconds", "Pay for your squad", "Same reference on both phones", "Cash still works"];
const B = ["Main Gate", "Hostel", "Library", "Faculty", "Lecture theatre", "Back gate", "Sports complex"];

function Row({ items, sep }: { items: string[]; sep: string }) {
  const run = (
    <span className="tape-run">
      {items.map((t) => (
        <span key={t}>
          {t}
          <i>{sep}</i>
        </span>
      ))}
    </span>
  );
  return (
    <div className="tape-track">
      {run}
      {run}
      {run}
    </div>
  );
}

export default function Tape() {
  return (
    <div className="tape" aria-hidden="true">
      <div className="tape-a">
        <Row items={A} sep="◆" />
      </div>
      <div className="tape-b">
        <Row items={B} sep="→" />
      </div>
    </div>
  );
}
