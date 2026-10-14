import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  ["How it works", "#how"],
  ["Pay for friends", "#squad"],
  ["Drivers", "#drivers"],
  ["Safety", "#trust"],
  ["FAQ", "#faq"],
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // The phone menu closes on Escape and when the screen grows past the phone layout.
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 881px)");
    const grow = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", key);
    wide.addEventListener("change", grow);
    return () => {
      window.removeEventListener("keydown", key);
      wide.removeEventListener("change", grow);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${solid || open ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="wrap nav-row">
        <a href="#top" aria-label="Konduct home" onClick={close}>
          <Logo />
        </a>
        <nav aria-label="Main">
          <ul>
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <a className="btn btn-yellow btn-sm nav-cta" href="#join">
            Join the pilot
          </a>
          <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav id="nav-menu" className="nav-menu" aria-label="Menu" hidden={!open}>
        <ul className="wrap">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={close}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a className="btn btn-yellow" href="#join" onClick={close}>
              Join the pilot
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
