// Pure home faceted-filter logic (REQ-035), shared by the client island and the
// tests. No DOM, no Astro — just the predicate and URL <-> criteria mapping.

export interface PostMeta {
  category?: string;
  tags: string[];
  /** ISO date; only the yyyy-mm-dd prefix is compared. */
  date: string;
}

export interface FilterCriteria {
  categories: string[];
  tags: string[];
  from?: string; // yyyy-mm-dd inclusive
  to?: string; // yyyy-mm-dd inclusive
}

export const EMPTY: FilterCriteria = { categories: [], tags: [] };

/** A post matches when it satisfies every active facet (AND across facets,
 *  OR within a facet). An empty facet imposes no constraint. */
export function matchesFilter(post: PostMeta, c: FilterCriteria): boolean {
  if (c.categories.length) {
    if (!post.category || !c.categories.includes(post.category)) return false;
  }
  if (c.tags.length) {
    if (!post.tags.some((t) => c.tags.includes(t))) return false;
  }
  const day = post.date.slice(0, 10);
  if (c.from && day < c.from) return false;
  if (c.to && day > c.to) return false;
  return true;
}

/** True when no facet is active (show everything). */
export function isEmpty(c: FilterCriteria): boolean {
  return (
    c.categories.length === 0 &&
    c.tags.length === 0 &&
    !c.from &&
    !c.to
  );
}

const splitList = (v: string | null): string[] =>
  v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

/** Read criteria from URL query params: ?cat=a,b&tag=x,y&from=&to= */
export function readFilter(params: URLSearchParams): FilterCriteria {
  return {
    categories: splitList(params.get("cat")),
    tags: splitList(params.get("tag")),
    from: params.get("from") || undefined,
    to: params.get("to") || undefined,
  };
}

/** Serialize criteria to a query string (leading "?" when non-empty, else ""). */
export function writeFilter(c: FilterCriteria): string {
  const p = new URLSearchParams();
  if (c.categories.length) p.set("cat", c.categories.join(","));
  if (c.tags.length) p.set("tag", c.tags.join(","));
  if (c.from) p.set("from", c.from);
  if (c.to) p.set("to", c.to);
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Toggle a value in a facet list, returning a new list. */
export function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}
