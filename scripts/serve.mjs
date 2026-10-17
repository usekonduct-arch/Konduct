// Serves dist/ the way Vercel does with vercel.json: clean URLs (/blog → blog/index.html),
// the rewrites, and 404.html. `npm run preview` uses it so local checks match production.
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const port = Number(process.env.PORT ?? 5180);
const { rewrites = [] } = JSON.parse(readFileSync("vercel.json", "utf8"));
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json", ".json": "application/json" };

function find(path) {
  const base = normalize(join(root, decodeURIComponent(path)));
  if (!base.startsWith(root)) return null;
  for (const f of [base, base + ".html", join(base, "index.html")]) if (existsSync(f) && statSync(f).isFile()) return f;
  return null;
}

function rewrite(path) {
  for (const r of rewrites) {
    const re = new RegExp("^" + r.source.replace(/:[a-z]+/g, "[^/]+") + "$");
    if (re.test(path)) return r.destination;
  }
  return null;
}

createServer((req, res) => {
  const path = new URL(req.url, "http://x").pathname.replace(/\/+$/, "") || "/";
  const file = find(path) ?? (rewrite(path) && find(rewrite(path)));
  const out = file ?? join(root, "404.html");
  res.writeHead(file ? 200 : 404, { "Content-Type": TYPES[extname(out)] ?? "application/octet-stream" });
  createReadStream(out).pipe(res);
}).listen(port, () => console.log(`serving dist/ like Vercel at http://localhost:${port}`));
