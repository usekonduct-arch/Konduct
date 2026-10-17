/**
 * Search and link-preview tags for every page: title, description, canonical URL, Open Graph,
 * X card, robots, and schema.org structured data (Organization, WebSite, MobileApplication,
 * FAQPage, BreadcrumbList, Blog, BlogPosting, JobPosting). The pre-renderer writes them into each
 * page's static HTML; pages loaded in the browser after a build update the title and description.
 */
import type { LegalDoc } from "../content/legal";
import { LEGAL_UPDATED, LEGAL_VERSION } from "../content/legal";
import { QA } from "../components/Faq";
import { SOCIAL_URLS } from "../components/Socials";
import { renderMarkdown } from "./markdown";
import { EMPLOYMENT, isoDate, type Job, type Post } from "./cms";
import type { Route } from "./route";
import { abs, SITE } from "./site";

export type PageData = { posts?: Post[]; post?: Post | null; related?: Post[]; jobs?: Job[]; job?: Job | null };

export type Head = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd: object[];
  published?: number;
  modified?: number;
  tags?: string[];
};

const ORG = {
  "@type": "Organization",
  "@id": `${SITE.url}/#org`,
  name: SITE.name,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: abs(SITE.logo), width: 512, height: 512 },
  description: SITE.description,
  areaServed: { "@type": "Country", name: "Nigeria" },
  address: { "@type": "PostalAddress", addressLocality: SITE.address.locality, addressRegion: SITE.address.region, addressCountry: SITE.address.country },
  sameAs: SOCIAL_URLS,
};
const orgRef = { "@id": `${SITE.url}/#org` };

const crumbs = (items: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");

function jobPosting(j: Job) {
  const remote = j.workplace === "remote";
  const pay = j.salaryMinNaira || j.salaryMaxNaira;
  return {
    "@type": "JobPosting",
    title: j.title,
    description: `<p>${j.summary}</p>` + renderMarkdown(j.body, SITE.url).html,
    identifier: { "@type": "PropertyValue", name: SITE.name, value: j.id },
    datePosted: isoDate(j.postedAtMs || j.updatedAtMs),
    ...(j.closesAtMs ? { validThrough: isoDate(j.closesAtMs) } : {}),
    employmentType: j.employment,
    hiringOrganization: { "@type": "Organization", name: SITE.name, sameAs: SITE.url, logo: abs(SITE.logo) },
    ...(remote
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Nigeria" } }
      : {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: j.location || SITE.address.locality, addressRegion: SITE.address.region, addressCountry: SITE.address.country },
          },
        }),
    ...(pay
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "NGN",
            value: {
              "@type": "QuantitativeValue",
              ...(j.salaryMinNaira ? { minValue: j.salaryMinNaira } : {}),
              ...(j.salaryMaxNaira ? { maxValue: j.salaryMaxNaira } : {}),
              ...(!j.salaryMinNaira || !j.salaryMaxNaira ? { value: j.salaryMinNaira || j.salaryMaxNaira } : {}),
              unitText: j.salaryUnit,
            },
          },
        }
      : {}),
    directApply: true,
    url: abs(`/careers/${j.slug}`),
  };
}

export function headFor(route: Route, data: PageData): Head {
  switch (route.name) {
    case "home":
      return {
        title: `Konduct · ${SITE.tagline}`,
        description: SITE.description,
        path: "/",
        jsonLd: [
          ORG,
          { "@type": "WebSite", "@id": `${SITE.url}/#site`, url: SITE.url, name: SITE.name, inLanguage: SITE.lang, publisher: orgRef },
          {
            "@type": "MobileApplication",
            name: "Konduct",
            operatingSystem: "Android",
            applicationCategory: "FinanceApplication",
            description: "Pay campus shuttle and bike fares by scanning the sticker on the vehicle. Fund your wallet by bank transfer or card.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
            publisher: orgRef,
          },
          { "@type": "FAQPage", mainEntity: QA.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) },
        ],
      };

    case "legal":
      return legalHead(route.doc);

    case "blog": {
      const posts = data.posts ?? [];
      return {
        title: "Blog · Konduct: campus transport, payments and student life",
        description: "Stories, guides and updates from Konduct: how cashless campus transport works, tips for riders and drivers, and news from UNIOSUN and beyond.",
        path: "/blog",
        jsonLd: [
          ORG,
          crumbs([["Blog", "/blog"]]),
          {
            "@type": "Blog",
            "@id": `${SITE.url}/blog#blog`,
            name: "The Konduct Blog",
            url: abs("/blog"),
            inLanguage: SITE.lang,
            publisher: orgRef,
            blogPost: posts.slice(0, 20).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(`/blog/${p.slug}`), datePublished: isoDate(p.publishedAtMs) })),
          },
        ],
      };
    }

    case "post": {
      const p = data.post;
      if (!p) return { title: "Konduct Blog", description: "Stories and updates from Konduct.", path: `/blog/${route.slug}`, noindex: true, jsonLd: [] };
      const image = p.coverUrl || SITE.ogImage;
      return {
        title: `${p.seoTitle || p.title} · Konduct Blog`,
        description: clip(p.seoDescription || p.excerpt, 160),
        path: `/blog/${p.slug}`,
        image,
        imageAlt: p.coverAlt || p.title,
        type: "article",
        published: p.publishedAtMs,
        modified: p.updatedAtMs,
        tags: p.tags,
        jsonLd: [
          ORG,
          crumbs([
            ["Blog", "/blog"],
            [p.title, `/blog/${p.slug}`],
          ]),
          {
            "@type": "BlogPosting",
            "@id": abs(`/blog/${p.slug}#post`),
            mainEntityOfPage: abs(`/blog/${p.slug}`),
            headline: clip(p.title, 110),
            description: p.excerpt,
            image: [abs(image)],
            datePublished: isoDate(p.publishedAtMs),
            dateModified: isoDate(p.updatedAtMs || p.publishedAtMs),
            author: { "@type": "Person", name: p.authorName, ...(p.authorRole ? { jobTitle: p.authorRole } : {}), worksFor: orgRef },
            publisher: orgRef,
            keywords: p.tags.join(", "),
            wordCount: renderMarkdown(p.body).text.split(" ").length,
            timeRequired: `PT${p.readMinutes}M`,
            inLanguage: SITE.lang,
            isPartOf: { "@id": `${SITE.url}/blog#blog` },
          },
        ],
      };
    }

    case "careers": {
      const open = (data.jobs ?? []).filter((j) => j.status === "open");
      return {
        title: `Careers at Konduct · ${open.length ? `${open.length} open role${open.length === 1 ? "" : "s"}` : "Join the team"}`,
        description: "Help build cashless campus transport for Nigerian students. See open roles at Konduct in engineering, operations, growth and campus teams, and apply online.",
        path: "/careers",
        jsonLd: [
          ORG,
          crumbs([["Careers", "/careers"]]),
          {
            "@type": "ItemList",
            name: "Open roles at Konduct",
            itemListElement: open.map((j, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/careers/${j.slug}`), name: j.title })),
          },
        ],
      };
    }

    case "job": {
      const j = data.job;
      if (!j) return { title: "Careers at Konduct", description: "Open roles at Konduct.", path: `/careers/${route.slug}`, noindex: true, jsonLd: [] };
      const closed = j.status !== "open";
      return {
        title: `${j.title}${closed ? " (closed)" : ""} · ${j.location} · Careers at Konduct`,
        description: clip(`${EMPLOYMENT[j.employment]} · ${j.location}. ${j.summary}`, 160),
        path: `/careers/${j.slug}`,
        // A closed role stays reachable for people with the link but leaves search and Google for Jobs.
        noindex: closed,
        jsonLd: [
          ORG,
          crumbs([
            ["Careers", "/careers"],
            [j.title, `/careers/${j.slug}`],
          ]),
          ...(closed ? [] : [jobPosting(j)]),
        ],
      };
    }

    case "notfound":
      return { title: "Page not found · Konduct", description: "That page isn't here. Head back to Konduct.", path: "/404", noindex: true, jsonLd: [] };
  }
}

function legalHead(doc: LegalDoc): Head {
  return {
    title: `${doc.title} · Konduct`,
    description: doc.description,
    path: `/${doc.slug}`,
    jsonLd: [
      ORG,
      crumbs([[doc.title, `/${doc.slug}`]]),
      { "@type": "WebPage", name: doc.title, url: abs(`/${doc.slug}`), description: doc.description, inLanguage: SITE.lang, version: LEGAL_VERSION, dateModified: LEGAL_VERSION, publisher: orgRef },
    ],
  };
}

/* ------------------------------------------------------------------ rendering the tags */
const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** The <head> tags for a page, as HTML (for the pre-renderer). */
export function headHtml(h: Head): string {
  const url = abs(h.path === "/404" ? "/" : h.path);
  const image = abs(h.image || SITE.ogImage);
  const isDefaultImage = !h.image || h.image === SITE.ogImage;
  const tags = [
    `<title>${attr(h.title)}</title>`,
    `<meta name="description" content="${attr(h.description)}"/>`,
    `<meta name="robots" content="${h.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}"/>`,
    h.noindex ? "" : `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:site_name" content="${SITE.name}"/>`,
    `<meta property="og:locale" content="${SITE.locale}"/>`,
    `<meta property="og:type" content="${h.type ?? "website"}"/>`,
    `<meta property="og:title" content="${attr(h.title)}"/>`,
    `<meta property="og:description" content="${attr(h.description)}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:image" content="${image}"/>`,
    isDefaultImage ? `<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>` : "",
    `<meta property="og:image:alt" content="${attr(h.imageAlt || "Konduct: tap, pay, ride. Cashless campus transport.")}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="${SITE.twitter}"/>`,
    `<meta name="twitter:title" content="${attr(h.title)}"/>`,
    `<meta name="twitter:description" content="${attr(h.description)}"/>`,
    `<meta name="twitter:image" content="${image}"/>`,
    h.published ? `<meta property="article:published_time" content="${isoDate(h.published)}"/>` : "",
    h.modified ? `<meta property="article:modified_time" content="${isoDate(h.modified)}"/>` : "",
    ...(h.tags ?? []).map((t) => `<meta property="article:tag" content="${attr(t)}"/>`),
    h.jsonLd.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": h.jsonLd }).replace(/</g, "\\u003c")}</script>` : "",
  ];
  return tags.filter(Boolean).join("\n    ");
}

/** For pages whose content loaded in the browser (published after the last build). */
export function applyHead(h: Head) {
  document.title = h.title;
  const set = (sel: string, make: () => HTMLElement, key: string, value: string) => {
    let el = document.head.querySelector(sel) as HTMLElement | null;
    if (!el) document.head.appendChild((el = make()));
    el.setAttribute(key, value);
  };
  set('meta[name="description"]', () => Object.assign(document.createElement("meta"), { name: "description" }), "content", h.description);
  set('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", abs(h.path));
}

export const LEGAL_STAMP = `Version ${LEGAL_VERSION} · last updated ${LEGAL_UPDATED}`;
