import { SITE } from "../config/site";
import { localeMeta } from "../i18n";

/** Absolute URL under the configured canonical origin (REQ-018). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/** Format a date for display in the given locale. */
export function formatDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(localeMeta(lang).htmlLang, {
    dateStyle: "long",
  }).format(date);
}

/** Machine-readable date for <time datetime> and structured data. */
export function isoDate(date: Date): string {
  return date.toISOString();
}
