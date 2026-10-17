/**
 * The website's pages. Every page is a real address with its own pre-rendered HTML (see
 * scripts/prerender.mjs), so links between pages are plain <a href> and need no client router.
 */
import { LEGAL_DOCS, type LegalDoc } from "../content/legal";

export type Route =
  | { name: "home" }
  | { name: "legal"; doc: LegalDoc }
  | { name: "blog" }
  | { name: "post"; slug: string }
  | { name: "careers" }
  | { name: "job"; slug: string }
  | { name: "notfound" };

/** Shells the host serves for a post or job published after the last build (vercel.json rewrites). */
export const POST_SHELL = "/blog/_post";
export const JOB_SHELL = "/careers/_job";

export function parseRoute(pathname: string): Route {
  const path = decodeURIComponent(pathname).replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
  if (path === "/") return { name: "home" };
  const legal = LEGAL_DOCS.find((d) => path === "/" + d.slug);
  if (legal) return { name: "legal", doc: legal };
  if (path === "/blog") return { name: "blog" };
  if (path === "/careers") return { name: "careers" };
  const post = path.match(/^\/blog\/([a-z0-9-_]+)$/);
  if (post) return { name: "post", slug: post[1] };
  const job = path.match(/^\/careers\/([a-z0-9-_]+)$/);
  if (job) return { name: "job", slug: job[1] };
  return { name: "notfound" };
}
