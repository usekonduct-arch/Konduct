import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import App from "./App";
import { parseRoute } from "./lib/route";
import type { PageData } from "./lib/seo";
import { prefersReducedMotion } from "./lib/naira";
import "./styles.css";
import "./pages.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scroll reveals hide content until it scrolls in, so only opt in when motion is welcome.
if (!prefersReducedMotion()) document.documentElement.classList.add("motion");

// Pre-rendered pages carry the data they were built with, so hydration matches the HTML exactly.
const data = ((window as unknown as { __KONDUCT__?: PageData }).__KONDUCT__ ?? {}) as PageData;
const route = parseRoute(window.location.pathname);
const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App route={route} data={data} />
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
