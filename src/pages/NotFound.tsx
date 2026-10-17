import PageShell, { PageHead } from "../components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <PageHead crumbs={[["Not found", "/404"]]} kicker="404" title="Wrong bus stop." lead="That page isn't here. It may have moved, or the link has a typo." />
      <div className="wrap empty-state" id="content">
        <div className="cta-row">
          <a className="btn btn-dark" href="/">
            Go to the home page
          </a>
          <a className="btn btn-outline" href="/blog">
            Read the blog
          </a>
        </div>
      </div>
    </PageShell>
  );
}
