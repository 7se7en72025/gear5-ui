"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useMemo, useState } from "react";
import { catalogHref, filterCatalog, type CatalogItem } from "@/lib/catalog";

const LivePreview = lazy(() => import("./preview").then((module) => ({ default: module.Preview })));
export type BrowserItem = CatalogItem;
export interface ComponentBrowserProps { items: BrowserItem[]; categories: string[] }

function ComponentCard({ item }: { item: BrowserItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="flex min-w-0 flex-col rounded-xl border border-hairline bg-anvil transition-colors hover:border-coral/40">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[11px] text-smoke">{item.name}.tsx</span>
          {item.tier && <span title="Gzipped size budget tier. See component docs for the ceiling." className="rounded border border-coral/20 bg-coral/5 px-1.5 py-0.5 font-mono text-[10px] text-coral">{item.tier.toUpperCase()}</span>}
        </div>
        <h3 className="text-lg font-medium tracking-tight text-cream"><Link href={`/components/${item.name}`} className="break-words underline-offset-4 hover:text-coral hover:underline">{item.title} <span aria-hidden="true" className="text-sm text-smoke">↗</span></Link></h3>
        <p className="mt-2 text-sm leading-relaxed text-smoke">{item.description}</p>
      </div>
      <div className="border-t border-hairline">
        <button type="button" aria-expanded={open} aria-controls={`preview-${item.name}`} onClick={() => setOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between gap-2 px-5 py-3 text-xs text-smoke hover:text-coral">
          <span>{open ? "Close" : "Try"} {item.title} preview</span><span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <div id={`preview-${item.name}`} hidden={!open}>
          {open && <div className="p-3 pt-0"><Suspense fallback={<p role="status" className="p-4 text-xs text-smoke">Loading preview…</p>}><LivePreview name={item.name} /></Suspense></div>}
        </div>
      </div>
    </li>
  );
}

function Results({ matches, category, query, clear }: { matches: BrowserItem[]; category: string | null; query: string; clear: () => void }) {
  const [visibleCount, setVisibleCount] = useState(24);
  const visibleItems = matches.slice(0, visibleCount);
  return (
    <div className="flex flex-col gap-6">
      <h2 className="sr-only">Component results</h2>
      <p role="status" className="text-sm text-smoke">
        Showing {visibleItems.length} of {matches.length} {matches.length === 1 ? "component" : "components"}
        {category && <> in <span className="text-cream">{category}</span></>}
      </p>
      {matches.length ? (
        <ul className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleItems.map((item) => <ComponentCard key={item.name} item={item} />)}</ul>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline px-5 py-16 text-center">
          <p className="font-mono text-sm text-coral">0 results</p>
          <h2 className="mt-3 text-xl text-cream">No components found</h2>
          <p className="mt-2 text-sm text-smoke">{query ? <>Nothing matches &ldquo;{query}&rdquo; with these filters.</> : "Try a different category."}</p>
          <button type="button" onClick={clear} className="button-secondary mt-6">Clear all filters</button>
        </div>
      )}
      {visibleCount < matches.length && <div className="flex flex-col items-center gap-3 border-t border-hairline pt-8">
        <button type="button" className="button-secondary" onClick={() => setVisibleCount((count) => count + 24)}>Show {Math.min(24, matches.length - visibleCount)} more components</button>
        <p className="text-xs text-smoke">Live previews load only when you open them.</p>
      </div>}
    </div>
  );
}

export function ComponentBrowser({ items, categories }: ComponentBrowserProps) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const requestedCategory = params.get("category");
  const category = requestedCategory && categories.includes(requestedCategory) ? requestedCategory : null;
  const sort = params.get("sort") === "name" ? "name" : "registry";
  const matches = useMemo(() => filterCatalog(items, query, category, sort), [items, query, category, sort]);
  const counts = useMemo(() => new Map(categories.map((name) => [name, items.filter((item) => item.category === name).length])), [items, categories]);

  function update(nextQuery: string, nextCategory: string | null, nextSort = sort, push = false) {
    const href = catalogHref(nextQuery, nextCategory, nextSort);
    // Next.js integrates native history with useSearchParams without a server request.
    if (push) window.history.pushState(null, "", href);
    else window.history.replaceState(null, "", href);
  }

  const chooseCategory = (name: string | null) => update(query, name, sort, true);
  const clear = () => update("", null, "registry", true);

  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
      <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-7">
        <nav aria-label="Component categories">
          <p className="eyebrow mb-4">Categories</p>
          <div className="flex flex-col gap-1">
            {[null, ...categories].map((name) => (
              <button key={name ?? "all"} type="button" onClick={() => chooseCategory(name)} aria-pressed={category === name} className={`flex min-h-10 items-center justify-between gap-2 rounded-md px-3 py-2 text-start text-sm transition-colors ${category === name ? "bg-coral/10 font-medium text-coral" : "text-smoke hover:bg-anvil hover:text-cream"}`}>
                <span>{name ?? "All components"}</span><span className="font-mono text-[10px]">{name ? counts.get(name) : items.length}</span>
              </button>
            ))}
          </div>
        </nav>
        <div className="flex flex-col gap-3 border-t border-hairline pt-5 text-sm text-smoke">
          <Link href="/getting-started" className="hover:text-coral">Installation guide →</Link>
          <a href="/r/index.json" className="hover:text-coral">Registry JSON ↗</a>
          <a href="/llms.txt" className="hover:text-coral">Agent index ↗</a>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-xl border border-hairline bg-anvil p-4 sm:p-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="component-search" className="text-sm font-medium text-cream">Search components</label>
            <div className="relative">
              <input id="component-search" type="search" value={query} onChange={(event) => update(event.target.value, category)} placeholder="Try “form”, “calendar”, or “async boundary”" className="min-h-12 w-full rounded-lg border border-hairline bg-canvas py-3 ps-4 pe-16 text-base text-cream placeholder:text-smoke focus:border-coral" />
              {query && <button type="button" onClick={() => update("", category)} className="absolute inset-y-1 end-1 rounded px-3 text-xs text-smoke hover:text-coral" aria-label="Clear search">Clear</button>}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-smoke lg:hidden">
              Category
              <select aria-label="Filter by category" value={category ?? ""} onChange={(event) => chooseCategory(event.target.value || null)} className="min-h-10 max-w-56 rounded-md border border-hairline bg-canvas px-2 text-sm text-cream">
                <option value="">All components ({items.length})</option>
                {categories.map((name) => <option key={name} value={name}>{name} ({counts.get(name)})</option>)}
              </select>
            </label>
            <p className="hidden text-xs text-smoke lg:block">Copy a link to share your search and filters.</p>
            <label className="flex items-center gap-2 text-xs text-smoke">Sort
              <select aria-label="Sort components" value={sort} onChange={(e) => update(query, category, e.target.value, true)} className="min-h-10 rounded-md border border-hairline bg-canvas px-2 text-sm text-cream"><option value="registry">Registry order</option><option value="name">Name A–Z</option></select>
            </label>
          </div>
        </div>
        <Results key={`${query}:${category}:${sort}`} matches={matches} query={query} category={category} clear={clear} />
      </div>
    </div>
  );
}
