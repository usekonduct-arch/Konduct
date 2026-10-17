// Turns the built single-page app into static HTML, one file per address, after `vite build`.
//   npm run build       (runs this last)
//
// Loads published posts and jobs from Firestore, renders every page with React on the server,
// writes its head tags (title, description, canonical, Open Graph, structured data) and the data the
// page was built with, then writes sitemap.xml, robots.txt and the blog's RSS feed. Blog cover
// images are copied next to the pages so they load from the CDN instead of the API server.
//
// Fails the build if Firestore can't be reached, rather than publishing a site with no blog.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const ssr = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const { render, fetchPosts, fetchJobs, related, LEGAL_DOCS, SITE, renderMarkdown } = ssr;
const template = readFileSync(resolve(dist, "index.html"), "utf8");

// PRERENDER_SAMPLE=1 previews the site locally with sample content (scripts/sample-content.mjs).
const sample = process.env.PRERENDER_SAMPLE === "1" ? await import("./sample-content.mjs") : null;
const [posts, jobs] = sample ? [sample.samplePosts, sample.sampleJobs] : await Promise.all([fetchPosts(), fetchJobs()]);
if (sample) console.warn("prerender: SAMPLE CONTENT, for local preview only");
console.log(`prerender: ${posts.length} posts, ${jobs.length} jobs`);

/* ------------------------------------------------------------------ cover images onto the CDN */
for (const p of posts) {
  const m = p.coverUrl.match(/^https:\/\/[^/]+\/media\/([A-Za-z0-9_-]{8,40})$/);
  if (!m || p.coverUrl.startsWith(SITE.url)) continue;
  try {
    const res = await fetch(p.coverUrl, { signal: AbortSignal.timeout(90_000) }); // the API server may be waking up
    if (!res.ok) throw new Error(String(res.status));
    const ext = (res.headers.get("content-type") ?? "").includes("png") ? "png" : (res.headers.get("content-type") ?? "").includes("webp") ? "webp" : "jpg";
    const file = `/media/${m[1]}.${ext}`;
    mkdirSync(resolve(dist, "media"), { recursive: true });
    writeFileSync(resolve(dist, "." + file), Buffer.from(await res.arrayBuffer()));
    p.coverUrl = file;
  } catch (e) {
    console.warn(`prerender: kept remote cover for ${p.slug} (${e.message})`);
  }
}

/* ------------------------------------------------------------------ pages */
// Safe inside <script>: no "</script>", and no U+2028/U+2029 (line breaks to older JS parsers).
const json = (v) => JSON.stringify(v).replace(/[<\u2028\u2029]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));

function write(path, data, file = path === "/" ? "index.html" : `${path.slice(1)}/index.html`, route) {
  const { html, head } = render(path, data, route);
  const page = template
    .replace("<!--head-->", head)
    .replace("<!--app-->", html)
    .replace("<!--data-->", `<script>window.__KONDUCT__=${json(data)}</script>`);
  const out = resolve(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
}

write("/", {});
for (const d of LEGAL_DOCS) write(`/${d.slug}`, {});
write("/blog", { posts });
for (const post of posts) write(`/blog/${post.slug}`, { post, related: related(post, posts) });
write("/careers", { jobs });
for (const job of jobs) write(`/careers/${job.slug}`, { job });

// Shells for content published after this build (vercel.json rewrites unknown slugs here). They
// carry no data, so the page fetches its own; they stay out of search until the next build.
write("/blog/_post", {}, "blog/_post/index.html", { name: "post", slug: "_post" });
write("/careers/_job", {}, "careers/_job/index.html", { name: "job", slug: "_job" });
write("/404", {}, "404.html", { name: "notfound" });

/* ------------------------------------------------------------------ sitemap, robots, feed */
const day = (ms) => new Date(ms).toISOString().slice(0, 10);
const newest = (...ms) => Math.max(...ms.filter(Boolean), Date.parse("2026-10-17"));
const openJobs = jobs.filter((j) => j.status === "open");
const urls = [
  { loc: "/", lastmod: newest(), priority: "1.0", changefreq: "weekly" },
  { loc: "/blog", lastmod: newest(...posts.map((p) => p.updatedAtMs)), priority: "0.8", changefreq: "daily" },
  ...posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAtMs || p.publishedAtMs, priority: "0.7", changefreq: "monthly", image: p.coverUrl, imageTitle: p.coverAlt })),
  { loc: "/careers", lastmod: newest(...jobs.map((j) => j.updatedAtMs)), priority: "0.7", changefreq: "weekly" },
  ...openJobs.map((j) => ({ loc: `/careers/${j.slug}`, lastmod: j.updatedAtMs || j.postedAtMs, priority: "0.6", changefreq: "weekly" })),
  ...LEGAL_DOCS.map((d) => ({ loc: `/${d.slug}`, lastmod: newest(), priority: "0.3", changefreq: "yearly" })),
];
const xml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => (/^https?:/.test(p) ? p : SITE.url + p);
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${xml(abs(u.loc === "/" ? "/" : u.loc))}</loc>
    <lastmod>${day(u.lastmod)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `\n    <image:image><image:loc>${xml(abs(u.image))}</image:loc>${u.imageTitle ? `<image:title>${xml(u.imageTitle)}</image:title>` : ""}</image:image>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

writeFileSync(
  resolve(dist, "robots.txt"),
  `# Konduct website
User-agent: *
Allow: /
Disallow: /blog/_post
Disallow: /careers/_job

Sitemap: ${SITE.url}/sitemap.xml
`,
);

const rfc822 = (ms) => new Date(ms).toUTCString();
writeFileSync(
  resolve(dist, "blog/feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>The Konduct Blog</title>
    <link>${SITE.url}/blog</link>
    <atom:link href="${SITE.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Stories, guides and updates from Konduct: cashless campus transport in Nigeria.</description>
    <language>en-ng</language>
    <lastBuildDate>${rfc822(Date.now())}</lastBuildDate>
${posts
  .slice(0, 30)
  .map(
    (p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${SITE.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.publishedAtMs)}</pubDate>
      <dc:creator>${xml(p.authorName)}</dc:creator>
${p.tags.map((t) => `      <category>${xml(t)}</category>`).join("\n")}
      <description>${xml(p.excerpt)}</description>
      <content:encoded><![CDATA[${(p.coverUrl ? `<p><img src="${abs(p.coverUrl)}" alt="${xml(p.coverAlt)}"/></p>` : "") + renderMarkdown(p.body, SITE.url).html.replace(/]]>/g, "]]&gt;")}]]></content:encoded>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`,
);

rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log(`prerender: wrote ${urls.length} sitemap URLs, robots.txt and blog/feed.xml`);
