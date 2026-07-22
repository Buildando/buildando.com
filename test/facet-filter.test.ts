import { describe, it, expect } from "vitest";
import {
  matchesFilter,
  readFilter,
  writeFilter,
  toggle,
  isEmpty,
  EMPTY,
  type PostMeta,
} from "../src/lib/facet-filter";

const post: PostMeta = {
  category: "Meta",
  tags: ["oo", "astro"],
  date: "2026-07-20",
};

describe("matchesFilter (REQ-035)", () => {
  it("passes everything when no facet is active", () => {
    expect(matchesFilter(post, EMPTY)).toBe(true);
  });

  it("filters by category (OR within, exact)", () => {
    expect(matchesFilter(post, { ...EMPTY, categories: ["Meta"] })).toBe(true);
    expect(matchesFilter(post, { ...EMPTY, categories: ["Boas Práticas"] })).toBe(false);
    expect(matchesFilter(post, { ...EMPTY, categories: ["Meta", "X"] })).toBe(true);
  });

  it("filters by tag (OR within: any selected tag matches)", () => {
    expect(matchesFilter(post, { ...EMPTY, tags: ["astro"] })).toBe(true);
    expect(matchesFilter(post, { ...EMPTY, tags: ["nope"] })).toBe(false);
    expect(matchesFilter(post, { ...EMPTY, tags: ["nope", "oo"] })).toBe(true);
  });

  it("filters by month (YYYY-MM, OR within)", () => {
    expect(matchesFilter(post, { ...EMPTY, months: ["2026-07"] })).toBe(true);
    expect(matchesFilter(post, { ...EMPTY, months: ["2026-06"] })).toBe(false);
    expect(matchesFilter(post, { ...EMPTY, months: ["2026-06", "2026-07"] })).toBe(true);
  });

  it("ANDs across facets", () => {
    expect(matchesFilter(post, { categories: ["Meta"], tags: ["oo"], months: ["2026-07"] })).toBe(true);
    expect(matchesFilter(post, { categories: ["Meta"], tags: ["missing"], months: [] })).toBe(false);
    expect(matchesFilter(post, { categories: ["Meta"], tags: [], months: ["2026-01"] })).toBe(false);
  });

  it("treats an uncategorized post as not matching a category filter", () => {
    const p: PostMeta = { tags: [], date: "2026-07-20" };
    expect(matchesFilter(p, { ...EMPTY, categories: ["Meta"] })).toBe(false);
    expect(matchesFilter(p, EMPTY)).toBe(true);
  });
});

describe("URL round-trip", () => {
  it("reads and writes the same criteria", () => {
    const c = { categories: ["Meta", "X"], tags: ["oo"], months: ["2026-07", "2026-06"] };
    const qs = writeFilter(c);
    expect(qs).toContain("cat=Meta%2CX");
    expect(qs).toContain("tag=oo");
    expect(qs).toContain("month=2026-07%2C2026-06");
    expect(readFilter(new URLSearchParams(qs))).toEqual(c);
  });

  it("writes an empty string for empty criteria", () => {
    expect(writeFilter(EMPTY)).toBe("");
    expect(isEmpty(readFilter(new URLSearchParams("")))).toBe(true);
  });
});

describe("toggle", () => {
  it("adds then removes a value", () => {
    expect(toggle([], "a")).toEqual(["a"]);
    expect(toggle(["a", "b"], "a")).toEqual(["b"]);
  });
});
