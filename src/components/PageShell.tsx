import type { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

/** Every page except the home page: the bar, a dark header band, the content, the footer. */
export default function PageShell({ current, children }: { current?: string; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Nav home={false} current={current} />
      <main id="top">{children}</main>
      <Footer home={false} />
    </>
  );
}

export function PageHead({ crumbs, kicker, title, lead, children, wide }: { crumbs: [string, string][]; kicker?: string; title: string; lead?: ReactNode; children?: ReactNode; wide?: boolean }) {
  return (
    <header className="page-head">
      <div className={`wrap ${wide ? "" : "page-head-narrow"}`}>
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li>
              <a href="/">Home</a>
            </li>
            {crumbs.map(([name, href], i) => (
              <li key={href}>{i === crumbs.length - 1 ? <span aria-current="page">{name}</span> : <a href={href}>{name}</a>}</li>
            ))}
          </ol>
        </nav>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="page-lead">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}
