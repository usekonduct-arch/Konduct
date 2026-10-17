import Logo from "./Logo";
import Socials from "./Socials";

/** On other pages the section links point back to the home page. */
export default function Footer({ home = true }: { home?: boolean }) {
  const at = (hash: string) => (home ? hash : "/" + hash);
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <div>
          <Logo />
          <p>Cashless campus transport. Piloting at UNIOSUN, then campus by campus.</p>
          <Socials />
        </div>
        <div className="footer-cols">
          <nav aria-label="Product">
            <b>Konduct</b>
            <a href={at("#how")}>How it works</a>
            <a href={at("#drivers")}>For drivers</a>
            <a href={at("#trust")}>Safety</a>
            <a href={at("#faq")}>FAQ</a>
            <a href={at("#join")}>Join the pilot</a>
          </nav>
          <nav aria-label="Company">
            <b>Company</b>
            <a href="/blog">Blog</a>
            <a href="/careers">Careers</a>
            <a href="/blog/feed.xml">RSS feed</a>
          </nav>
          <nav aria-label="Legal">
            <b>Legal</b>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/delete-account">Delete your account</a>
          </nav>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} Konduct</span>
        <span>Wallet funds are held by a licensed payment partner.</span>
      </div>
    </footer>
  );
}
