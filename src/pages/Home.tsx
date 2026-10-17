import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Tape from "../components/Tape";
import Problem from "../components/Problem";
import HowItWorks from "../components/HowItWorks";
import Squad from "../components/Squad";
import Drivers from "../components/Drivers";
import Trust from "../components/Trust";
import Roadmap from "../components/Roadmap";
import Faq from "../components/Faq";
import Join from "../components/Join";
import Footer from "../components/Footer";
import TopUpReturn from "../components/TopUpReturn";

export default function Home() {
  useGSAP(() => {
    if (!document.documentElement.classList.contains("motion")) return;
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
    });
    // Fonts change line heights after first paint; re-measure trigger positions once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Tape />
        <Problem />
        <HowItWorks />
        <Squad />
        <Drivers />
        <Trust />
        <Roadmap />
        <Faq />
        <Join />
      </main>
      <Footer />
      <TopUpReturn />
    </>
  );
}
