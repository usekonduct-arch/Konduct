import Home from "./pages/Home";
import LegalPage from "./pages/LegalPage";
import { BlogIndex, PostPage } from "./pages/Blog";
import { CareersIndex, JobPage } from "./pages/Careers";
import NotFound from "./pages/NotFound";
import type { Route } from "./lib/route";
import type { PageData } from "./lib/seo";

/** One page per address. `data` is what the pre-renderer loaded; without it, pages fetch their own. */
export default function App({ route, data }: { route: Route; data: PageData }) {
  switch (route.name) {
    case "home":
      return <Home />;
    case "legal":
      return <LegalPage doc={route.doc} />;
    case "blog":
      return <BlogIndex posts={data.posts} />;
    case "post":
      return <PostPage slug={route.slug} post={data.post} related={data.related} />;
    case "careers":
      return <CareersIndex jobs={data.jobs} />;
    case "job":
      return <JobPage slug={route.slug} job={data.job} />;
    case "notfound":
      return <NotFound />;
  }
}
