import { useEffect, useMemo, useState, type FormEvent } from "react";
import PageShell, { PageHead } from "../components/PageShell";
import { apply, dateText, EMPLOYMENT, fetchJob, fetchJobs, isoDate, salaryText, WORKPLACE, type Job } from "../lib/cms";
import { renderMarkdown } from "../lib/markdown";
import { applyHead, headFor } from "../lib/seo";
import { SITE } from "../lib/site";

const VALUES = [
  ["Riders first", "Every screen is tested at a real park, with a real phone, on a slow network."],
  ["Money is sacred", "Every naira is on the ledger, every action is logged, and we'd rather pause than guess."],
  ["Small team, big ownership", "You'll ship things students use the next morning, and own them end to end."],
  ["Built in Nigeria", "We design for Osun first: Pidgin, Yorùbá and Hausa, bad network, no change."],
];

function useLoaded<T>(initial: T | undefined, load: () => Promise<T>) {
  const [value, setValue] = useState<T | undefined>(initial);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (initial !== undefined) return;
    load().then(setValue, () => setFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { value, failed };
}

const Facts = ({ job }: { job: Job }) => (
  <ul className="job-facts">
    <li>{job.team}</li>
    <li>{job.location}</li>
    <li>{EMPLOYMENT[job.employment]}</li>
    <li>{WORKPLACE[job.workplace]}</li>
  </ul>
);

/* ------------------------------------------------------------------ all roles */

export function CareersIndex({ jobs: initial }: { jobs?: Job[] }) {
  const { value: jobs, failed } = useLoaded(initial, fetchJobs);
  const open = (jobs ?? []).filter((j) => j.status === "open");
  const teams = useMemo(() => [...new Set(open.map((j) => j.team))], [open]);

  return (
    <PageShell current="/careers">
      <PageHead crumbs={[["Careers", "/careers"]]} kicker="Careers at Konduct" title="Help campuses move without cash." lead="We're a small team building payments for the buses and bikes students ride every day. Come build it with us." wide>
        <a className="btn btn-yellow" href="#roles">
          See open roles{open.length ? ` (${open.length})` : ""}
        </a>
      </PageHead>
      <div id="content">
        <section className="wrap values" aria-labelledby="how-we-work">
          <h2 id="how-we-work">How we work</h2>
          <div className="values-grid">
            {VALUES.map(([t, d]) => (
              <div key={t} className="value">
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="wrap roles" id="roles" aria-labelledby="open-roles">
          <h2 id="open-roles">Open roles</h2>
          {jobs === undefined ? (
            <p className="empty">{failed ? "Couldn't load roles. Check your connection and refresh." : "Loading roles…"}</p>
          ) : !open.length ? (
            <div className="empty-state">
              <h3>No open roles right now.</h3>
              <p>
                We're always glad to hear from people who care about campus transport. Send a short note and your CV to <a href={`mailto:${SITE.careersEmail}`}>{SITE.careersEmail}</a>.
              </p>
            </div>
          ) : (
            teams.map((team) => (
              <div key={team} className="team">
                <h3>{team}</h3>
                <ul className="job-list">
                  {open
                    .filter((j) => j.team === team)
                    .map((j) => (
                      <li key={j.id}>
                        <a href={`/careers/${j.slug}`} className="job-row">
                          <span className="job-row-main">
                            <b>{j.title}</b>
                            <span>{j.summary}</span>
                          </span>
                          <span className="job-row-meta">
                            <span>{j.location}</span>
                            <span>
                              {EMPLOYMENT[j.employment]} · {WORKPLACE[j.workplace]}
                            </span>
                          </span>
                          <span className="job-row-go" aria-hidden="true">
                            →
                          </span>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ one role */

export function JobPage({ slug, job: initial }: { slug: string; job?: Job | null }) {
  const { value: job, failed } = useLoaded(initial, () => fetchJob(slug));
  useEffect(() => {
    if (initial === undefined && job) applyHead(headFor({ name: "job", slug }, { job }));
  }, [job, initial, slug]);
  const body = useMemo(() => (job ? renderMarkdown(job.body).html : ""), [job]);

  if (job === undefined) return <PageShell current="/careers"><PageHead crumbs={[["Careers", "/careers"]]} title={failed ? "Couldn't load this role." : "Loading…"} /></PageShell>;
  if (!job)
    return (
      <PageShell current="/careers">
        <PageHead crumbs={[["Careers", "/careers"]]} title="This role isn't here." lead="It may have been filled or taken down." />
        <div className="wrap empty-state" id="content">
          <a className="btn btn-dark" href="/careers">
            See open roles
          </a>
        </div>
      </PageShell>
    );

  const open = job.status === "open";
  const pay = salaryText(job);
  return (
    <PageShell current="/careers">
      <PageHead
        crumbs={[
          ["Careers", "/careers"],
          [job.title, `/careers/${job.slug}`],
        ]}
        kicker={job.team}
        title={job.title}
        lead={job.summary}
      >
        <Facts job={job} />
      </PageHead>
      <div className="wrap job" id="content">
        <article className="prose job-body">
          {!open ? <p className="job-closed">This role is closed. Thank you to everyone who applied.</p> : null}
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </article>
        <aside className="job-side">
          <dl className="job-card">
            <div>
              <dt>Team</dt>
              <dd>{job.team}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{job.location}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>
                {EMPLOYMENT[job.employment]} · {WORKPLACE[job.workplace]}
              </dd>
            </div>
            {pay ? (
              <div>
                <dt>Pay</dt>
                <dd>{pay}</dd>
              </div>
            ) : null}
            <div>
              <dt>Posted</dt>
              <dd>
                <time dateTime={isoDate(job.postedAtMs || job.updatedAtMs)}>{dateText(job.postedAtMs || job.updatedAtMs)}</time>
              </dd>
            </div>
            {job.closesAtMs ? (
              <div>
                <dt>{open ? "Apply by" : "Closed"}</dt>
                <dd>
                  <time dateTime={isoDate(job.closesAtMs)}>{dateText(job.closesAtMs)}</time>
                </dd>
              </div>
            ) : null}
          </dl>
          {open ? (
            <a className="btn btn-yellow job-apply-jump" href="#apply">
              Apply for this role
            </a>
          ) : (
            <a className="btn btn-dark job-apply-jump" href="/careers">
              See open roles
            </a>
          )}
        </aside>
        {open ? <ApplyForm job={job} /> : null}
      </div>
    </PageShell>
  );
}

function ApplyForm({ job }: { job: Job }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", link: "", note: "", consent: false, website: "" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: { target: { value: string; checked?: boolean; type?: string } }) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.website) return setState("done"); // a bot filled the hidden field
    const name = f.name.trim().replace(/\s+/g, " ");
    const email = f.email.trim().toLowerCase();
    let link = f.link.trim();
    if (link && !/^https?:\/\//i.test(link)) link = "https://" + link;
    link = link.replace(/^http:\/\//i, "https://");
    if (name.length < 3) return (setError("Enter your full name."), setState("error"));
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return (setError("Enter a valid email address."), setState("error"));
    if (!/^https:\/\/\S+\.\S+/.test(link)) return (setError("Add a link to your CV, LinkedIn or portfolio (Google Drive, Dropbox and LinkedIn links all work)."), setState("error"));
    if (!f.consent) return (setError("Please agree to how we handle your application."), setState("error"));
    setState("busy");
    try {
      await apply({ jobId: job.id, jobTitle: job.title, name, email, phone: f.phone.trim().slice(0, 30), link, note: f.note.trim().slice(0, 3000) });
      setState("done");
    } catch {
      setError("That didn't go through. Check your connection and try again. If the role has just closed, it will no longer accept applications.");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <section className="apply apply-done" id="apply" aria-live="polite">
        <h2>Application sent. Thank you!</h2>
        <p>We read every application and will reply by email within two weeks, whatever the outcome.</p>
      </section>
    );

  return (
    <section className="apply" id="apply" aria-labelledby="apply-h">
      <h2 id="apply-h">Apply for {job.title}</h2>
      <p>Takes two minutes. No account needed.</p>
      <form onSubmit={submit} noValidate>
        <div className="apply-grid">
          <label>
            Full name
            <input required autoComplete="name" value={f.name} onChange={set("name")} maxLength={80} />
          </label>
          <label>
            Email
            <input required type="email" autoComplete="email" inputMode="email" value={f.email} onChange={set("email")} maxLength={120} />
          </label>
          <label>
            Phone <small>(optional)</small>
            <input type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set("phone")} maxLength={30} />
          </label>
          <label>
            Link to your CV, LinkedIn or portfolio
            <input required type="url" inputMode="url" placeholder="https://" value={f.link} onChange={set("link")} maxLength={500} />
          </label>
        </div>
        <label>
          Why this role? <small>(optional)</small>
          <textarea rows={5} value={f.note} onChange={set("note")} maxLength={3000} />
        </label>
        <label className="hp" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
        </label>
        <label className="check">
          <input type="checkbox" checked={f.consent} onChange={set("consent")} />
          <span>
            I agree that Konduct may use these details to consider me for this role and keep them for up to 12 months, as described in the <a href="/privacy">Privacy Policy</a>.
          </span>
        </label>
        {state === "error" ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn btn-dark" type="submit" disabled={state === "busy"}>
          {state === "busy" ? "Sending…" : "Send application"}
        </button>
      </form>
    </section>
  );
}
