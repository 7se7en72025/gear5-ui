import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { catalogHref, filterCatalog } from "@/lib/catalog";
import { allItems, components, componentsByCategory, getItem, resolveDependencies } from "@/lib/registry";

const items = components.map((item) => ({ ...item, category: item.category ?? "" }));

describe("component catalog", () => {
  it("categorises every component exactly once", () => {
    expect(items.every((item) => Boolean(item.category))).toBe(true);
    const grouped = componentsByCategory().flatMap((group) => group.items);
    expect(new Set(grouped.map((item) => item.name)).size).toBe(items.length);
    expect(grouped).toHaveLength(items.length);
  });

  it("finds names with spaces or hyphens and ignores casing", () => {
    expect(filterCatalog(items, "  ASYNC boundary ", null).map((item) => item.name)).toContain("async-boundary");
    expect(filterCatalog(items, "async-boundary", null).map((item) => item.name)).toContain("async-boundary");
  });

  it("combines category and query instead of silently dropping either", () => {
    expect(filterCatalog(items, "password", "Forms & input").length).toBeGreaterThan(0);
    expect(filterCatalog(items, "password", "Navigation")).toEqual([]);
  });

  it("sorts results without mutating the registry order", () => {
    const before = items.map((item) => item.name);
    const result = filterCatalog(items, "", null, "name");
    expect(result.map((item) => item.title)).toEqual(result.map((item) => item.title).sort((a, b) => a.localeCompare(b, "en")));
    expect(items.map((item) => item.name)).toEqual(before);
  });

  it("round-trips shared URLs with reserved characters", () => {
    const href = catalogHref("forms & input #1", "Forms & input", "name");
    const params = new URL(href, "https://example.com").searchParams;
    expect(params.get("q")).toBe("forms & input #1");
    expect(params.get("category")).toBe("Forms & input");
    expect(params.get("sort")).toBe("name");
    expect(catalogHref()).toBe("/components");
  });

  it("returns an empty result for unmatched searches", () => {
    expect(filterCatalog(items, "thereisnocomponentlikethis", null)).toEqual([]);
  });

  it("resolves every shared install dependency to a real registry item", () => {
    for (const item of components) {
      const dependencies = resolveDependencies(item.name);
      expect(new Set(dependencies).size).toBe(dependencies.length);
      expect(dependencies.every((name) => Boolean(getItem(name)))).toBe(true);
    }
  });

  it("declares every local registry import for a complete fresh install", () => {
    const ownerByFile = new Map(
      allItems.flatMap((item) =>
        item.files.map((file) => [
          file.path.split("/").pop()!.replace(/\.tsx?$/, ""),
          item.name,
        ] as const),
      ),
    );

    for (const item of allItems) {
      const declared = new Set(item.registryDependencies ?? []);
      for (const file of item.files) {
        const source = readFileSync(join(process.cwd(), file.path), "utf8");
        for (const match of source.matchAll(/from\s+["'](\.\.?\/[^"']+)["']/g)) {
          const imported = match[1].split("/").pop()!.replace(/\.tsx?$/, "");
          const owner = ownerByFile.get(imported);
          if (owner && owner !== item.name) {
            expect(declared, `${item.name} imports ${owner} but does not declare it`).toContain(owner);
          }
        }
      }
    }
  });
});
