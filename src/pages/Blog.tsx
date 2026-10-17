import { useEffect, useMemo, useState } from "react";
import PageShell, { PageHead } from "../components/PageShell";
import { dateText, fetchPost, fetchPosts, isoDate, related as relatedTo, type Post } from "../lib/cms";
import { renderMarkdown } from "../lib/markdown";
import { applyHead, headFor } from "../lib/seo";
import { abs } from "../lib/site";

/* ------------------------------------------------------------------ shared */

function Cover({ post, eager, sizes }: { post: Post; eager?: boolean; sizes: string }) {
  if (!post.coverUrl)
    return (
      <div className="cover cover-fallback" aria-hidden="true">
        <span>{post.tags[0] ?? "Konduct"}</span>
      </div>
    );
  return (
    <img
      className="cover"
      src={post.coverUrl}
      alt={post.coverAlt}
      width={1200}
      height={630}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      {...(eager ? { fetchPriority: "high" as const } : {})}
    />
  );
}

function Byline({ post }: { post: Post }) {
  return (
    <p className="byline">
      <span>{post.authorName}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={isoDate(post.publishedAtMs)}>{dateText(post.publishedAtMs)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readMinutes} min read</span>
    </p>
  );
}

function Card({ post, big }: { post: Post; big?: boolean }) {
  return (
    <article className={`post-card ${big ? "post-card-big" : ""}`}>
      <a href={`/blog/${post.slug}`} className="post-card-link">
        <Cover post={post} eager={big} sizes={big ? "(min-width: 900px) 640px, 100vw" : "(min-width: 900px) 380px, 100vw"} />
        <div className="post-card-body">
          {post.tags.length ? <p className="post-tags">{post.tags.slice(0, 2).join(" · ")}</p> : null}
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <Byline post={post} />
        </div>
      </a>
    </article>
  );
}

/** Content published after the last build loads here in the browser. */
function useLoaded<T>(initial: T | undefined, load: () => Promise<T>) {
  const [value, setValue] = useState<T | undefined>(initial);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (initial !== undefined) return;
    load().then(setValue, () => setFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { value, failed };
}

/* ------------------------------------------------------------------ the blog */

export function BlogIndex({ posts: initial }: { posts?: Post[] }) {
  const { value: posts, failed } = useLoaded(initial, fetchPosts);
  const [tag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => [...new Set((posts ?? []).flatMap((p) => p.tags))].slice(0, 12), [posts]);
  const shown = (posts ?? []).filter((p) => !tag || p.tags.includes(tag));
  const [first, ...rest] = shown;

  return (
    <PageShell current="/blog">
      <PageHead crumbs={[["Blog", "/blog"]]} kicker="The Konduct Blog" title="Stories from the road." lead="Guides for riders and drivers, campus transport news, and what we're building next." wide>
        {tags.length > 1 ? (
          <div className="tag-row" role="group" aria-label="Filter by topic">
            <button type="button" className={!tag ? "on" : ""} aria-pressed={!tag} onClick={() => setTag(null)}>
              All
            </button>
            {tags.map((t) => (
              <button type="button" key={t} className={tag === t ? "on" : ""} aria-pressed={tag === t} onClick={() => setTag(t)}>
                {t}
              </button>
            ))}
          </div>
        ) : null}
      </PageHead>
      <section className="wrap blog" id="content" aria-label="Posts">
        {posts === undefined ? (
          failed ? (
            <p className="empty">Couldn't load the posts. Check your connection and refresh.</p>
          ) : (
            <p className="empty">Loading posts…</p>
          )
        ) : !first ? (
          <div className="empty-state">
            <h2>First stories coming soon.</h2>
            <p>We're writing about how Konduct works on campus. Follow us on social media to catch the first post.</p>
          </div>
        ) : (
          <>
            <Card post={first} big />
            {rest.length ? (
              <div className="post-grid">
                {rest.map((p) => (
                  <Card key={p.id} post={p} />
                ))}
              </div>
            ) : null}
          </>
        )}
        <CtaBand />
      </section>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ one post */

function Share({ post }: { post: Post }) {
  const url = abs(`/blog/${post.slug}`);
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  return (
    <div className="share" aria-label="Share this post">
      <span>Share</span>
      <a href={`https://x.com/intent/post?text=${enc(post.title)}&url=${enc(url)}`} target="_blank" rel="noopener">
        X
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener">
        LinkedIn
      </a>
      <a href={`https://wa.me/?text=${enc(`${post.title} ${url}`)}`} target="_blank" rel="noopener">
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          })
        }
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

export function PostPage({ slug, post: initial, related: initialRelated }: { slug: string; post?: Post | null; related?: Post[] }) {
  const { value: post, failed } = useLoaded(initial, () => fetchPost(slug));
  const [related, setRelated] = useState<Post[]>(initialRelated ?? []);
  useEffect(() => {
    if (initial !== undefined || !post) return;
    applyHead(headFor({ name: "post", slug }, { post }));
    fetchPosts().then((all) => setRelated(relatedTo(post, all)), () => {});
  }, [post, initial, slug]);
  const body = useMemo(() => (post ? renderMarkdown(post.body) : null), [post]);

  if (post === undefined) return <PageShell current="/blog"><PageHead crumbs={[["Blog", "/blog"]]} title={failed ? "Couldn't load this post." : "Loading…"} /></PageShell>;
  if (!post)
    return (
      <PageShell current="/blog">
        <PageHead crumbs={[["Blog", "/blog"]]} title="This post isn't here." lead="It may have moved or been taken down." />
        <div className="wrap empty-state" id="content">
          <a className="btn btn-dark" href="/blog">
            See all posts
          </a>
        </div>
      </PageShell>
    );

  return (
    <PageShell current="/blog">
      <article className="post">
        <PageHead
          crumbs={[
            ["Blog", "/blog"],
            [post.title, `/blog/${post.slug}`],
          ]}
          kicker={post.tags[0]}
          title={post.title}
          lead={post.excerpt}
        >
          <Byline post={post} />
        </PageHead>
        <div className="wrap post-wrap" id="content">
          <figure className="post-cover">
            <Cover post={post} eager sizes="(min-width: 1000px) 920px, 100vw" />
          </figure>
          <div className="post-grid-body">
            {body!.toc.length > 2 ? (
              <aside className="post-side">
                <nav aria-label="In this post" className="toc">
                  <b>In this post</b>
                  <ol>
                    {body!.toc
                      .filter((t) => t.level === 2)
                      .map((t) => (
                        <li key={t.id}>
                          <a href={`#${t.id}`}>{t.text}</a>
                        </li>
                      ))}
                  </ol>
                </nav>
              </aside>
            ) : null}
            <div className="prose post-body" dangerouslySetInnerHTML={{ __html: body!.html }} />
          </div>
          <footer className="post-foot">
            {post.tags.length ? (
              <ul className="post-tag-list" aria-label="Topics">
                {post.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
            <Share post={post} />
            <p className="author-box">
              <b>{post.authorName}</b>
              {post.authorRole ? <span>{post.authorRole}, Konduct</span> : null}
            </p>
          </footer>
        </div>
      </article>
      {related.length ? (
        <section className="wrap related" aria-labelledby="more">
          <h2 id="more">Keep reading</h2>
          <div className="post-grid">
            {related.map((p) => (
              <Card key={p.id} post={p} />
            ))}
          </div>
        </section>
      ) : null}
      <div className="wrap">
        <CtaBand />
      </div>
    </PageShell>
  );
}

export function CtaBand() {
  return (
    <aside className="cta-band" aria-label="Get Konduct">
      <div>
        <p className="kicker">Tap. Pay. Ride.</p>
        <h2>No change? No wahala.</h2>
        <p>Konduct is live at UNIOSUN. Join the pilot and be first on when it reaches your park.</p>
      </div>
      <a className="btn btn-dark" href="/#join">
        Join the pilot
      </a>
    </aside>
  );
}
