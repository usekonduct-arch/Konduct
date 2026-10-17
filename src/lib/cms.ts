/**
 * Blog posts and job openings, read straight from Firestore over its REST API (no SDK). Staff write
 * them in the console through the backend (konduct-backend/functions/src/domain/site.ts); the rules
 * let anyone read published posts and open or closed jobs, nothing else.
 *
 * The pre-renderer calls these at build time, and the browser calls them for content published
 * after the last build.
 */
const PROJECT = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined) || "konduct-10ffb";
const API_KEY = (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined) || "AIzaSyAg4HZS4Q5-cB4LC4nimKzzilf9m5Iv0u4";
const DB = `projects/${PROJECT}/databases/(default)`;
const BASE = `https://firestore.googleapis.com/v1/${DB}`;

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  coverAlt: string;
  tags: string[];
  authorName: string;
  authorRole: string;
  seoTitle: string;
  seoDescription: string;
  readMinutes: number;
  publishedAtMs: number;
  updatedAtMs: number;
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  workplace: "onsite" | "hybrid" | "remote";
  employment: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN" | "VOLUNTEER";
  summary: string;
  body: string;
  salaryMinNaira: number | null;
  salaryMaxNaira: number | null;
  salaryUnit: "MONTH" | "YEAR";
  closesAtMs: number | null;
  status: "open" | "closed";
  postedAtMs: number;
  updatedAtMs: number;
};

/* ------------------------------------------------------------------ Firestore value decoding */
type FsValue = Record<string, unknown>;
function decode(v: FsValue): unknown {
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return Date.parse(String(v.timestampValue));
  if ("arrayValue" in v) return ((v.arrayValue as { values?: FsValue[] }).values ?? []).map(decode);
  if ("mapValue" in v) return fields((v.mapValue as { fields?: Record<string, FsValue> }).fields ?? {});
  return null;
}
const fields = (f: Record<string, FsValue>) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));

const str = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const numOrNull = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

function toPost(id: string, d: Record<string, unknown>): Post {
  return {
    id,
    slug: str(d.slug),
    title: str(d.title),
    excerpt: str(d.excerpt),
    body: str(d.body),
    coverUrl: str(d.coverUrl),
    coverAlt: str(d.coverAlt),
    tags: Array.isArray(d.tags) ? d.tags.map(str).filter(Boolean) : [],
    authorName: str(d.authorName) || "The Konduct team",
    authorRole: str(d.authorRole),
    seoTitle: str(d.seoTitle),
    seoDescription: str(d.seoDescription),
    readMinutes: num(d.readMinutes) || 1,
    publishedAtMs: num(d.publishedAtMs),
    updatedAtMs: num(d.updatedAtMs) || num(d.publishedAtMs),
  };
}

function toJob(id: string, d: Record<string, unknown>): Job {
  return {
    id,
    slug: str(d.slug),
    title: str(d.title),
    team: str(d.team),
    location: str(d.location),
    workplace: (["onsite", "hybrid", "remote"].includes(str(d.workplace)) ? d.workplace : "onsite") as Job["workplace"],
    employment: (str(d.employment) || "FULL_TIME") as Job["employment"],
    summary: str(d.summary),
    body: str(d.body),
    salaryMinNaira: numOrNull(d.salaryMinNaira),
    salaryMaxNaira: numOrNull(d.salaryMaxNaira),
    salaryUnit: d.salaryUnit === "YEAR" ? "YEAR" : "MONTH",
    closesAtMs: numOrNull(d.closesAtMs),
    // A role past its closing date reads as closed even before staff close it.
    status: d.status === "open" && !(numOrNull(d.closesAtMs) && num(d.closesAtMs) < Date.now()) ? "open" : "closed",
    postedAtMs: num(d.postedAtMs),
    updatedAtMs: num(d.updatedAtMs) || num(d.postedAtMs),
  };
}

/* ------------------------------------------------------------------ queries */
type Filter = Record<string, unknown>;
const eq = (field: string, value: string): Filter => ({ fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: value } } });
const isIn = (field: string, values: string[]): Filter => ({
  fieldFilter: { field: { fieldPath: field }, op: "IN", value: { arrayValue: { values: values.map((v) => ({ stringValue: v })) } } },
});
const and = (...filters: Filter[]): Filter => ({ compositeFilter: { op: "AND", filters } });

async function query(collectionId: string, where: Filter, limit = 500) {
  const res = await fetch(`${BASE}/documents:runQuery?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId }], where, limit } }),
  });
  if (!res.ok) throw new Error(`${collectionId} ${res.status}`);
  const rows = (await res.json()) as { document?: { name: string; fields?: Record<string, FsValue> } }[];
  return rows.filter((r) => r.document).map((r) => ({ id: r.document!.name.split("/").pop()!, data: fields(r.document!.fields ?? {}) }));
}

const newestPost = (a: Post, b: Post) => b.publishedAtMs - a.publishedAtMs;

export async function fetchPosts(): Promise<Post[]> {
  return (await query("posts", eq("status", "published"))).map((r) => toPost(r.id, r.data)).filter((p) => p.slug && p.title).sort(newestPost);
}

export async function fetchPost(slug: string): Promise<Post | null> {
  const rows = await query("posts", and(eq("status", "published"), eq("slug", slug)), 1);
  return rows[0] ? toPost(rows[0].id, rows[0].data) : null;
}

export async function fetchJobs(): Promise<Job[]> {
  return (await query("jobs", isIn("status", ["open", "closed"])))
    .map((r) => toJob(r.id, r.data))
    .filter((j) => j.slug && j.title)
    .sort((a, b) => (a.status === b.status ? b.postedAtMs - a.postedAtMs : a.status === "open" ? -1 : 1));
}

export async function fetchJob(slug: string): Promise<Job | null> {
  const rows = await query("jobs", and(isIn("status", ["open", "closed"]), eq("slug", slug)), 1);
  return rows[0] ? toJob(rows[0].id, rows[0].data) : null;
}

/** Posts that share a tag with this one first, then the newest. */
export function related(post: Post, all: Post[], n = 3) {
  const others = all.filter((p) => p.id !== post.id);
  const score = (p: Post) => p.tags.filter((t) => post.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a) || newestPost(a, b)).slice(0, n);
}

/* ------------------------------------------------------------------ applications */
export type Application = { jobId: string; jobTitle: string; name: string; email: string; phone: string; link: string; note: string };

/** Rules (firestore.rules, /applications) check the shape and that the role is open. */
export async function apply(a: Application): Promise<void> {
  const s = (v: string) => ({ stringValue: v });
  const res = await fetch(`${BASE}/documents:commit?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `${DB}/documents/applications/${crypto.randomUUID()}`,
            fields: {
              jobId: s(a.jobId),
              jobTitle: s(a.jobTitle.slice(0, 100)),
              name: s(a.name),
              email: s(a.email),
              phone: s(a.phone),
              link: s(a.link),
              note: s(a.note),
              consent: { booleanValue: true },
              status: s("new"),
              source: s("careers"),
            },
          },
          updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }],
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`application ${res.status}`);
}

/* ------------------------------------------------------------------ labels */
export const EMPLOYMENT: Record<Job["employment"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
  VOLUNTEER: "Volunteer",
};
export const WORKPLACE: Record<Job["workplace"], string> = { onsite: "On site", hybrid: "Hybrid", remote: "Remote (Nigeria)" };

export function salaryText(j: Job) {
  const f = (n: number) => "₦" + n.toLocaleString("en-NG");
  const per = j.salaryUnit === "YEAR" ? "a year" : "a month";
  if (j.salaryMinNaira && j.salaryMaxNaira) return `${f(j.salaryMinNaira)} – ${f(j.salaryMaxNaira)} ${per}`;
  if (j.salaryMinNaira) return `From ${f(j.salaryMinNaira)} ${per}`;
  if (j.salaryMaxNaira) return `Up to ${f(j.salaryMaxNaira)} ${per}`;
  return "";
}

export const dateText = (ms: number) => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
export const isoDate = (ms: number) => new Date(ms).toISOString();
