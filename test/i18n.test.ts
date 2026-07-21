import { describe, it, expect } from "vitest";
import {
  useTranslations,
  localizedPath,
  langFromUrl,
  hreflangAlternates,
  siteTitle,
  siteDescription,
  defaultLocale,
} from "../src/i18n";
import { SITE } from "../src/config/site";

describe("useTranslations (REQ-032)", () => {
  it("returns the locale's string", () => {
    expect(useTranslations("pt")("nav.home")).toBe("Início");
    expect(useTranslations("en")("nav.home")).toBe("Home");
  });

  it("falls back to the default locale, then to the key", () => {
    // 'site.title' is defined only for en; pt falls back to the key.
    expect(useTranslations("pt")("site.title")).toBe("site.title");
    expect(useTranslations("en")("totally.unknown.key")).toBe(
      "totally.unknown.key",
    );
  });
});

describe("site identity strings (REQ-032)", () => {
  it("uses config defaults for the default locale and overrides otherwise", () => {
    expect(siteTitle("pt")).toBe(SITE.title);
    expect(siteDescription("pt")).toBe(SITE.description);
    expect(siteTitle("en")).toBe("Buildando — by Fernando Teixeira");
    expect(siteDescription("en").toLowerCase()).toContain(
      "software development",
    );
  });
});

describe("localizedPath", () => {
  it("prefixes the locale, normalizing the leading slash", () => {
    expect(localizedPath("en", "/tags/")).toBe("/en/tags/");
    expect(localizedPath("en", "tags")).toBe("/en/tags");
    expect(localizedPath("pt", "/")).toBe("/pt/");
  });
});

describe("langFromUrl", () => {
  it("reads a known locale from the first segment", () => {
    expect(langFromUrl(new URL("https://x.dev/en/posts/a/"))).toBe("en");
    expect(langFromUrl(new URL("https://x.dev/pt/"))).toBe("pt");
  });
  it("falls back to the default locale for unknown/absent segments", () => {
    expect(langFromUrl(new URL("https://x.dev/"))).toBe(defaultLocale);
    expect(langFromUrl(new URL("https://x.dev/zz/foo/"))).toBe(defaultLocale);
  });
});

describe("hreflangAlternates", () => {
  it("emits one absolute alternate per locale plus x-default", () => {
    const alts = hreflangAlternates("/");
    const langs = alts.map((a) => a.hreflang);
    expect(langs).toContain("pt-BR");
    expect(langs).toContain("en");
    expect(langs).toContain("x-default");
    for (const a of alts) expect(a.href.startsWith(SITE.url)).toBe(true);
  });
});
