/**
 * Server entry for the pre-renderer (scripts/prerender.mjs): renders one page to HTML and gives its
 * head tags. Built with `vite build --ssr`.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { parseRoute, type Route } from "./lib/route";
import { headFor, headHtml, type PageData } from "./lib/seo";

export { fetchJobs, fetchPosts, related } from "./lib/cms";
export { LEGAL_DOCS } from "./content/legal";
export { SITE } from "./lib/site";
export { renderMarkdown } from "./lib/markdown";

export function render(path: string, data: PageData, route: Route = parseRoute(path)) {
  const html = renderToString(
    <StrictMode>
      <App route={route} data={data} />
    </StrictMode>,
  );
  const head = headFor(route, data);
  return { html, head: headHtml(head), noindex: Boolean(head.noindex) };
}
