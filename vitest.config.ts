import { defineConfig } from "vitest/config";

// Unit tests cover the pure logic modules (i18n helpers, post routing). They do
// not import `astro:content`, so they run in plain Node without the Astro runtime.
// Build-output assertions live in test/build.test.ts and run against dist/.
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
