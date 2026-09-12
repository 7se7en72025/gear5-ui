"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Preview } from "./preview";

export interface BrowserItem {
  name: string;
  title: string;
  description: string;
  category: string;
  tier?: string;
}

export interface ComponentBrowserProps {
  items: BrowserItem[];
  categories: string[];
}

const TIER_BADGES: Record<string, { label: string; color: string }> = {
  xs: { label: "XS", color: "border-[#eebe52]/35 bg-[#eebe52]/10 text-[#8a5c0c] dark:text-[#eebe52]" },
  sm: { label: "SM", color: "border-[#c8b69e]/35 bg-[#c8b69e]/10 text-[#705d47] dark:text-[#d9cbb9]" },
  md: { label: "MD", color: "border-[#b07b3c]/35 bg-[#b07b3c]/10 text-[#7b4f18] dark:text-[#e7b66a]" },
  lg: { label: "LG", color: "border-[#c82227]/35 bg-[#c82227]/10 text-[#9b292d] dark:text-[#f08d8d]" },
};

export function ComponentBrowser({ items, categories }: ComponentBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      if (category && item.category !== category) return false;
      if (!needle) return true;

      return (
        item.name.includes(needle) ||
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle)
      );
    });
  }, [items, query, category]);

  const visibleItems = matches.slice(0, visibleCount);

  const grouped = useMemo(() => {
    const groups = new Map<string, BrowserItem[]>();

    for (const item of visibleItems) {
      const existing = groups.get(item.category);
      if (existing) existing.push(item);
      else groups.set(item.category, [item]);
    }

    return [...groups];
  }, [visibleItems]);

  const chooseCategory = (name: string | null) => {
    setCategory(name === category ? null : name);
    setVisibleCount(24);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
      <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-6">
        <div className="border-l border-hairline pl-4">
          <p className="text-caption font-semibold tracking-[0.14em] text-smoke uppercase">Documentation</p>
          <a href="#component-search" className="mt-3 block text-sm font-medium text-cream hover:text-coral">Browse all</a>
          <a href="/r/index.json" className="mt-2 block text-sm text-smoke transition-colors hover:text-cream">Registry JSON ↗</a>
          <a href="/llms.txt" className="mt-2 block text-sm text-smoke transition-colors hover:text-cream">Agent index ↗</a>
        </div>

        <div className="border-l border-hairline pl-4">
          <p className="text-caption font-semibold tracking-[0.14em] text-smoke uppercase">Categories</p>
          <div className="mt-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => chooseCategory(null)}
              className={category === null ? "-ml-2 rounded-md bg-coral/12 px-2 py-1.5 text-left text-sm font-medium text-coral" : "-ml-2 rounded-md px-2 py-1.5 text-left text-sm text-smoke transition-colors hover:text-cream"}
            >
              All components
            </button>
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => chooseCategory(name)}
                className={category === name ? "-ml-2 rounded-md bg-coral/12 px-2 py-1.5 text-left text-sm font-medium text-coral" : "-ml-2 rounded-md px-2 py-1.5 text-left text-sm text-smoke transition-colors hover:text-cream"}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-hairline pb-8">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="component-search" className="text-sm font-medium">
            Search components
          </label>
            <div className="relative">
            <svg
              className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              id="component-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(24);
              }}
              placeholder="Search by name, description, or category..."
              className="w-full rounded-lg border border-hairline bg-anvil py-2.5 ps-10 pe-4 text-base text-cream placeholder:text-smoke/70 transition-colors focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setVisibleCount(24);
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Clear search"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => chooseCategory(null)}
            aria-pressed={category === null}
            className={
              category === null
                ? "rounded-full bg-coral px-3.5 py-1.5 text-sm font-medium text-on-accent transition-colors"
                : "rounded-full border border-hairline px-3.5 py-1.5 text-sm text-smoke transition-colors hover:border-cream/40 hover:text-cream"
            }
          >
            All
          </button>

          {categories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => chooseCategory(name)}
              aria-pressed={category === name}
              className={
                category === name
                  ? "rounded-full bg-coral px-3.5 py-1.5 text-sm font-medium text-on-accent transition-colors"
                  : "rounded-full border border-hairline px-3.5 py-1.5 text-sm text-smoke transition-colors hover:border-cream/40 hover:text-cream"
              }
            >
              {name}
            </button>
          ))}
        </div>

        <p role="status" aria-live="polite" className="text-sm text-smoke">
          Showing {visibleItems.length} of {matches.length} {matches.length === 1 ? "component" : "components"}
          {category && <> in <span className="font-medium text-cream">{category}</span></>}
          {query && <> matching <span className="font-medium text-cream">&ldquo;{query}&rdquo;</span></>}
        </p>
      </div>

      {grouped.map(([name, groupItems]) => (
        <section key={name} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-cream">{name}</h2>

          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupItems.map((item) => (
              <li
                key={item.name}
                className="group relative flex flex-col gap-3 rounded-xl border border-hairline bg-anvil p-4 transition-all hover:border-cream/30 hover:shadow-lg"
              >
                  <div className="relative overflow-hidden rounded-lg bg-canvas/60">
                  <Preview name={item.name} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-sm font-semibold text-cream">
                      <Link
                        href={`/components/${item.name}`}
                        className="after:absolute after:inset-0 after:z-10 underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {item.tier && TIER_BADGES[item.tier] && (
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_BADGES[item.tier].color}`}>
                        {TIER_BADGES[item.tier].label}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-smoke">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {visibleItems.length < matches.length && (
        <div className="flex flex-col items-center gap-3 border-t border-hairline pt-8 text-center">
          <p className="text-body-sm text-smoke">
            More components are available. Load them only when you need them.
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 24)}
            className="rounded-md border border-hairline px-5 py-2.5 text-body-sm text-cream transition-colors hover:border-coral hover:text-coral"
          >
            Show 24 more components
          </button>
        </div>
      )}

      {matches.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <svg className="size-12 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400">
            No components match &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Try a broader term, or{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(null);
                setVisibleCount(24);
              }}
              className="text-coral hover:underline"
            >
              clear all filters
            </button>
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
