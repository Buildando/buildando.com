// Pure home faceted-filter logic (REQ-035), shared by the client island and the
// tests. No DOM, no Astro — just the predicate and URL <-> criteria mapping.
// Facets: category, tag, and month (YYYY-MM), all as toggle sets (OR within, AND
// across). The month facet replaces the earlier date range.

export interface PostMeta {
  category?: string;
  tags: string[];
  /** ISO date; the yyyy-mm prefix is compared for the month facet. */
  date: string;
}

export interface FilterCriteria {
  categories: string[];
  tags: string[];
  months: string[]; // each "YYYY-MM"
}

export const EMPTY: FilterCriteria = { categories: [], tags: [], months: [] };

/** A post matches when it satisfies every active facet (AND across facets,
 *  OR within a facet). An empty facet imposes no constraint. */
export function matchesFilter(post: PostMeta, c: FilterCriteria): boolean {
  if (c.categories.length) {
    if (!post.category || !c.categories.includes(post.category)) return false;
  }
  if (c.tags.length) {
    if (!post.tags.some((t) => c.tags.includes(t))) return false;
  }
  if (c.months.length) {
    if (!c.months.includes(post.date.slice(0, 7))) return false;
  }
  return true;
}

/** True when no facet is active (show everything). */
export function isEmpty(c: FilterCriteria): boolean {
  return (
    c.categories.length === 0 && c.tags.length === 0 && c.months.length === 0
  );
}

const splitList = (v: string | null): string[] =>
  v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

/** Read criteria from URL query params: ?cat=a,b&tag=x,y&month=2026-07,2026-06 */
export function readFilter(params: URLSearchParams): FilterCriteria {
  return {
    categories: splitList(params.get("cat")),
    tags: splitList(params.get("tag")),
    months: splitList(params.get("month")),
  };
}

/** Serialize criteria to a query string (leading "?" when non-empty, else ""). */
export function writeFilter(c: FilterCriteria): string {
  const p = new URLSearchParams();
  if (c.categories.length) p.set("cat", c.categories.join(","));
  if (c.tags.length) p.set("tag", c.tags.join(","));
  if (c.months.length) p.set("month", c.months.join(","));
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Toggle a value in a facet list, returning a new list. */
export function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}
