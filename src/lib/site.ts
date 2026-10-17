/** Site-wide facts used by the pages, the SEO tags and the pre-renderer. */
export const SITE = {
  url: "https://konduct.com.ng",
  name: "Konduct",
  tagline: "Pay your campus bus fare with one scan",
  description:
    "Konduct is cashless campus transport for Nigerian students. Fund your wallet, scan the sticker on the shuttle or bike, and ride. Drivers are paid in seconds. Live at UNIOSUN.",
  locale: "en_NG",
  lang: "en-NG",
  twitter: "@usekonduct",
  /** The default link-preview picture (1200 × 630), in public/. */
  ogImage: "/og/konduct-og.png",
  logo: "/icons/konduct-512.png",
  careersEmail: "careers@konduct.com.ng",
  address: { locality: "Osogbo", region: "Osun", country: "NG" },
};

export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : SITE.url + (path.startsWith("/") ? path : "/" + path));
