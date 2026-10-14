export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
