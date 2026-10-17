import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    // In `npm run dev` there's no pre-renderer, so give the page a plain title.
    {
      name: "dev-head",
      apply: "serve",
      transformIndexHtml: (html) => html.replace("<!--head-->", "<title>Konduct (dev)</title>"),
    },
  ],
});
