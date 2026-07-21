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
    expect(matchesFilter(post, { categories: ["Meta"], tags: [] })).toBe(true);
    expect(matchesFilter(post, { categories: ["Boas Práticas"], tags: [] })).toBe(false);
    expect(matchesFilter(post, { categories: ["Meta", "X"], tags: [] })).toBe(true);
  });

  it("filters by tag (OR within: any selected tag matches)", () => {
    expect(matchesFilter(post, { categories: [], tags: ["astro"] })).toBe(true);
    expect(matchesFilter(post, { categories: [], tags: ["nope"] })).toBe(false);
    expect(matchesFilter(post, { categories: [], tags: ["nope", "oo"] })).toBe(true);
  });

  it("filters by date range (inclusive)", () => {
    expect(matchesFilter(post, { ...EMPTY, from: "2026-07-20" })).toBe(true);
    expect(matchesFilter(post, { ...EMPTY, from: "2026-07-21" })).toBe(false);
    expect(matchesFilter(post, { ...EMPTY, to: "2026-07-20" })).toBe(true);
    expect(matchesFilter(post, { ...EMPTY, to: "2026-07-19" })).toBe(false);
    expect(matchesFilter(post, { ...EMPTY, from: "2026-01-01", to: "2026-12-31" })).toBe(true);
  });

  it("ANDs across facets", () => {
    expect(
      matchesFilter(post, { categories: ["Meta"], tags: ["oo"], from: "2026-01-01" }),
    ).toBe(true);
    expect(
      matchesFilter(post, { categories: ["Meta"], tags: ["missing"] }),
    ).toBe(false);
  });

  it("treats an uncategorized post as not matching a category filter", () => {
    const p: PostMeta = { tags: [], date: "2026-07-20" };
    expect(matchesFilter(p, { categories: ["Meta"], tags: [] })).toBe(false);
    expect(matchesFilter(p, EMPTY)).toBe(true);
  });
});

describe("URL round-trip", () => {
  it("reads and writes the same criteria", () => {
    const c = { categories: ["Meta", "X"], tags: ["oo"], from: "2026-01-01", to: "2026-07-31" };
    const qs = writeFilter(c);
    expect(qs).toContain("cat=Meta%2CX");
    expect(qs).toContain("tag=oo");
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
