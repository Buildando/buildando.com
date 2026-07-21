import { I18N, SITE, type LocaleCode } from "../config/site";
import { ui } from "./ui";

export const locales = I18N.locales.map((l) => l.code) as LocaleCode[];
export const defaultLocale = I18N.defaultLocale;

export function localeMeta(code: string) {
  return I18N.locales.find((l) => l.code === code) ?? I18N.locales[0];
}

/** Translator bound to a locale, with fallback to the default locale then the key. */
export function useTranslations(lang: string) {
  return function t(key: string): string {
    return ui[lang]?.[key] ?? ui[defaultLocale]?.[key] ?? key;
  };
}

/** Localized site title, falling back to the config value (REQ-032). */
export function siteTitle(lang: string): string {
  return ui[lang]?.["site.title"] ?? SITE.title;
}

/** Localized site description/tagline, falling back to the config value (REQ-032). */
export function siteDescription(lang: string): string {
  return ui[lang]?.["site.description"] ?? SITE.description;
}

/** Prefix a root-relative path with the locale: ("/tags/") → "/en/tags/". */
export function localizedPath(lang: string, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean}`;
}

/** The first path segment as a locale, or the default locale. */
export function langFromUrl(url: URL): LocaleCode {
  const seg = url.pathname.split("/")[1];
  return (locales as string[]).includes(seg)
    ? (seg as LocaleCode)
    : (defaultLocale as LocaleCode);
}

/** hreflang alternates for a path that exists in every locale (listings, home). */
export function hreflangAlternates(pathWithoutLocale: string) {
  const alternates = I18N.locales.map((l) => ({
    hreflang: l.htmlLang,
    href: new URL(localizedPath(l.code, pathWithoutLocale), SITE.url).toString(),
  }));
  alternates.push({
    hreflang: "x-default",
    href: new URL(
      localizedPath(defaultLocale, pathWithoutLocale),
      SITE.url,
    ).toString(),
  });
  return alternates;
}
