import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Build-output assertions. Skipped unless dist/ exists — run `npm run test:build`
// (which builds first), or `npm run build` before `npm test`.
const dist = join(process.cwd(), "dist");
const src = join(process.cwd(), "src");
const read = (...p: string[]) => readFileSync(join(dist, ...p), "utf8");
const has = (...p: string[]) => existsSync(join(dist, ...p));

describe.skipIf(!existsSync(dist))("build output", () => {
  it("redirects the root to the default locale (REQ-032)", () => {
    expect(read("index.html")).toContain("/pt/");
  });

  it("emits per-locale homes, feeds, sitemap, robots (REQ-014–016, 032)", () => {
    expect(has("pt", "index.html")).toBe(true);
    expect(has("en", "index.html")).toBe(true);
    expect(has("pt", "rss.xml")).toBe(true);
    expect(has("en", "rss.xml")).toBe(true);
    expect(has("sitemap-index.xml")).toBe(true);
    expect(read("robots.txt")).toContain("Sitemap:");
  });

  it("emits full SEO on a post page (REQ-011–013, 018)", () => {
    const html = read("pt", "posts", "exemplo-bem-vindo-ao-buildando", "index.html");
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/buildando\.com/);
    expect(html).toContain('property="og:image" content="https://buildando.com/');
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain('"@type":"BreadcrumbList"'); // REQ-013
  });

  it("generates a dynamic OG card for a cover-less post (REQ-012)", () => {
    const html = read("pt", "posts", "exemplo-so-em-portugues", "index.html");
    expect(html).toContain(
      'property="og:image" content="https://buildando.com/og/exemplo-so-em-portugues.png"',
    );
    expect(has("og", "exemplo-so-em-portugues.png")).toBe(true);
  });

  it("renders the home hero from markdown (REQ-034)", () => {
    // Markdown-rendered headings get slug ids; a hardcoded hero would not.
    expect(read("pt", "index.html")).toContain('<h1 id="buildando"');
    expect(read("en", "index.html")).toContain('<h1 id="buildando"');
  });

  it("localizes the site tagline on the english home (REQ-032)", () => {
    expect(read("en", "index.html")).toContain(
      "Software development best practices",
    );
  });

  it("serves an untranslated post under the other locale with translated chrome (REQ-033)", () => {
    const fb = read("en", "posts", "exemplo-so-em-portugues", "index.html");
    expect(fb).toContain('<html lang="en"');
    expect(fb).toContain('aria-label="Main"'); // nav chrome in English (nav.aria)
    expect(fb).toContain('<article lang="pt-BR"'); // body marked Portuguese
    expect(fb).toContain(
      'rel="canonical" href="https://buildando.com/pt/posts/exemplo-so-em-portugues/"',
    );
  });

  it("builds a static client search index (REQ-020, 021)", () => {
    expect(has("pagefind", "pagefind.js")).toBe(true);
  });

  it("emits no analytics/ads third-party scripts by default (REQ-038)", () => {
    const html = read("pt", "index.html");
    expect(html).not.toContain("googletagmanager.com");
    expect(html).not.toContain("adsbygoogle");
    expect(html).not.toContain("plausible.io");
  });

  it("renders no newsletter form by default (REQ-039)", () => {
    expect(read("pt", "index.html")).not.toContain('class="newsletter"');
  });

  it("shows share buttons on a post (REQ-040)", () => {
    const html = read("pt", "posts", "exemplo-bem-vindo-ao-buildando", "index.html");
    expect(html).toContain("x.com/intent/tweet");
    expect(html).toContain("wa.me/?text=");
    expect(html).toContain("share-copy"); // copy-link button present
  });

  it("renders the home facet filter, hidden until JS (REQ-035)", () => {
    const html = read("pt", "index.html");
    expect(html).toContain('id="filter-bar" hidden');
    expect(html).toContain('data-filter="category"');
    expect(html).toContain('data-filter="month"'); // month chips (date facet)
    // Cards carry the metadata the filter reads.
    expect(html).toMatch(/class="card" data-category="[^"]*" data-tags="[^"]*" data-date="/);
  });

  it("exposes search from the layout on every page (REQ-036)", () => {
    for (const page of ["pt/index.html", "en/index.html", "pt/posts/exemplo-so-em-portugues/index.html"]) {
      const html = readFileSync(join(dist, page), "utf8");
      expect(html).toContain('class="search-trigger"');
      expect(html).toContain('id="search-dialog"');
    }
  });
});

// Source-level invariant, independent of dist.
describe("identity confined to the config surface (REQ-030)", () => {
  it("the domain appears in src only inside config/site.ts", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (/\.(astro|ts|js|md)$/.test(entry.name)) {
          if (full.endsWith(join("config", "site.ts"))) continue;
          if (readFileSync(full, "utf8").includes("buildando.com")) {
            offenders.push(full);
          }
        }
      }
    };
    walk(src);
    expect(offenders).toEqual([]);
  });
});
