export interface CatalogItem {
  name: string;
  title: string;
  description: string;
  category: string;
  tier?: string;
}

/** Token matching lets both "async boundary" and "async-boundary" find an item. */
export function filterCatalog<T extends CatalogItem>(items: T[], query: string, category: string | null, sort = "registry"): T[] {
  const tokens = query.toLowerCase().trim().split(/[\s-]+/).filter(Boolean);
  const matches = items.filter((item) => {
    if (category && item.category !== category) return false;
    const haystack = `${item.name} ${item.title} ${item.description} ${item.category}`.toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
  return sort === "name" ? matches.sort((a, b) => a.title.localeCompare(b.title, "en")) : matches;
}

export function catalogHref(query = "", category: string | null = null, sort = "registry"): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (sort === "name") params.set("sort", sort);
  return `/components${params.size ? `?${params}` : ""}`;
}
