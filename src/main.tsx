import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import App from "./App";
import { prefersReducedMotion } from "./lib/naira";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scroll reveals hide content until it scrolls in, so only opt in when motion is welcome.
if (!prefersReducedMotion()) document.documentElement.classList.add("motion");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
