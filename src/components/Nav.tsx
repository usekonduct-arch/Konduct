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
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${solid ? "is-solid" : ""}`}>
      <div className="wrap nav-row">
        <a href="#top" aria-label="Konduct home">
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
        <a className="btn btn-yellow btn-sm" href="#join">
          Join the pilot
        </a>
      </div>
    </header>
  );
}
