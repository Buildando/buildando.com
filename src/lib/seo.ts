import { SITE } from "../config/site";
import { localeMeta } from "../i18n";

/** Absolute URL under the configured canonical origin (REQ-018). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/** Format a date for display in the given locale. Dates are authored date-only
 *  (UTC midnight), so format in UTC to avoid an off-by-one in other timezones. */
export function formatDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(localeMeta(lang).htmlLang, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

/** Machine-readable date for <time datetime> and structured data. */
export function isoDate(date: Date): string {
  return date.toISOString();
}
