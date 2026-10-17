import { COMPANY, LEGAL_DOCS, type Block, type LegalDoc } from "../content/legal";
import PageShell, { PageHead } from "../components/PageShell";
import { LEGAL_STAMP } from "../lib/seo";

function BlockView({ b }: { b: Block }) {
  if (typeof b === "string") return <p>{b}</p>;
  if ("list" in b)
    return (
      <ul>
        {b.list.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    );
  if ("note" in b) return <p className="legal-note">{b.note}</p>;
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table">
      <table>
        <thead>
          <tr>
            {b.table.head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {b.table.rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <PageShell>
      <PageHead crumbs={[[doc.title, `/${doc.slug}`]]} kicker="Legal" title={doc.title} lead={doc.description}>
        <p className="page-meta mono">{LEGAL_STAMP}</p>
      </PageHead>
      <div className="wrap legal" id="content">
        <aside className="legal-side">
          <nav aria-label="On this page" className="toc">
            <b>On this page</b>
            <ol>
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading.replace(/^\d+\.\s*/, "")}</a>
                </li>
              ))}
            </ol>
          </nav>
          <nav aria-label="Other policies" className="toc toc-docs">
            <b>Policies</b>
            {LEGAL_DOCS.map((d) => (
              <a key={d.slug} href={`/${d.slug}`} aria-current={d.slug === doc.slug ? "page" : undefined}>
                {d.title}
              </a>
            ))}
          </nav>
        </aside>
        <article className="prose legal-body">
          <section className="tldr" aria-labelledby="tldr">
            <h2 id="tldr">The short version</h2>
            <ul>
              {doc.summary.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="tldr-foot">This summary helps you read the full text below; it doesn't replace it.</p>
          </section>
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{s.heading}</h2>
              {s.blocks.map((b, i) => (
                <BlockView key={i} b={b} />
              ))}
            </section>
          ))}
          <p className="legal-contact">
            Questions? Email <a href={`mailto:${doc.slug === "terms" ? COMPANY.support : COMPANY.privacy}`}>{doc.slug === "terms" ? COMPANY.support : COMPANY.privacy}</a>.
          </p>
        </article>
      </div>
    </PageShell>
  );
}
