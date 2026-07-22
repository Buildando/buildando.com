import { describe, it, expect } from "vitest";
import { planPostRoutes, type PlannedRoute } from "../src/lib/post-routes";
import { SITE } from "../src/config/site";

// Absolute URLs derive from the one configured origin, so a fork restyles the
// domain without touching these expectations (REQ-018, REQ-030).
const origin = SITE.url;

const find = (routes: PlannedRoute[], lang: string, slug: string) =>
  routes.find((r) => r.params.lang === lang && r.params.slug === slug);

describe("planPostRoutes — fully translated pair (REQ-032, REQ-033)", () => {
  const routes = planPostRoutes([
    { lang: "pt", slug: "a", translations: { en: "b" } },
    { lang: "en", slug: "b", translations: { pt: "a" } },
  ]);

  it("emits only the two canonicals, no fallback", () => {
    expect(routes).toHaveLength(2);
    expect(find(routes, "pt", "a")).toBeDefined();
    expect(find(routes, "en", "b")).toBeDefined();
    expect(find(routes, "en", "a")).toBeUndefined();
    expect(find(routes, "pt", "b")).toBeUndefined();
  });

  it("switches language straight to the translation", () => {
    expect(find(routes, "pt", "a")!.langSwitch).toEqual({
      pt: "/pt/posts/a/",
      en: "/en/posts/b/",
    });
  });

  it("canonical of each is itself", () => {
    expect(find(routes, "pt", "a")!.canonicalPath).toBe("/pt/posts/a/");
    expect(find(routes, "en", "b")!.canonicalPath).toBe("/en/posts/b/");
  });

  it("hreflang lists both real versions and x-default", () => {
    const alts = find(routes, "pt", "a")!.alternates;
    const map = Object.fromEntries(alts.map((a) => [a.hreflang, a.href]));
    expect(map["pt-BR"]).toBe(`${origin}/pt/posts/a/`);
    expect(map["en"]).toBe(`${origin}/en/posts/b/`);
    expect(map["x-default"]).toBe(`${origin}/pt/posts/a/`);
  });
});

describe("planPostRoutes — untranslated post falls back (REQ-033)", () => {
  const routes = planPostRoutes([{ lang: "pt", slug: "x" }]);

  it("emits the canonical plus a fallback in the other locale", () => {
    expect(routes).toHaveLength(2);
    expect(find(routes, "pt", "x")!.uiLang).toBe("pt");
    expect(find(routes, "en", "x")!.uiLang).toBe("en");
  });

  it("keeps the same slug on the fallback (same content, translated chrome)", () => {
    const fb = find(routes, "en", "x")!;
    expect(fb.params.slug).toBe("x");
    expect(fb.sourceKey).toBe("pt:x");
  });

  it("points the fallback canonical at the source post (dedupe)", () => {
    expect(find(routes, "en", "x")!.canonicalPath).toBe("/pt/posts/x/");
  });

  it("hreflang lists only the real version, never the fallback", () => {
    const langs = find(routes, "pt", "x")!.alternates.map((a) => a.hreflang);
    expect(langs).toContain("pt-BR");
    expect(langs).toContain("x-default");
    expect(langs).not.toContain("en");
  });

  it("switcher offers the fallback URL for the untranslated locale", () => {
    expect(find(routes, "pt", "x")!.langSwitch.en).toBe("/en/posts/x/");
  });
});

describe("planPostRoutes — stale translation link degrades (REQ-033 risk)", () => {
  it("ignores a declared translation whose target does not exist", () => {
    const routes = planPostRoutes([
      { lang: "pt", slug: "y", translations: { en: "missing" } },
    ]);
    // No en:missing post exists → treated as untranslated → fallback to /en/posts/y/.
    expect(find(routes, "en", "y")).toBeDefined();
    expect(find(routes, "pt", "y")!.langSwitch.en).toBe("/en/posts/y/");
  });
});

describe("planPostRoutes — english-only post (REQ-033)", () => {
  const routes = planPostRoutes([{ lang: "en", slug: "z" }]);
  it("fallback goes to pt with canonical back to the en source", () => {
    expect(find(routes, "en", "z")!.canonicalPath).toBe("/en/posts/z/");
    expect(find(routes, "pt", "z")!.uiLang).toBe("pt");
    expect(find(routes, "pt", "z")!.canonicalPath).toBe("/en/posts/z/");
  });
});
