import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <div>
          <Logo />
          <p>Cashless campus transport. Piloting at UNIOSUN, then campus by campus.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#drivers">For drivers</a>
          <a href="#trust">Safety</a>
          <a href="#faq">FAQ</a>
          <a href="#join">Join the pilot</a>
        </nav>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} Konduct</span>
        <span>Wallet funds are held by a licensed payment partner.</span>
      </div>
    </footer>
  );
}
