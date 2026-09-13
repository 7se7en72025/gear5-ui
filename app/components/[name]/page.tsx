import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Copyable } from "@/components/site/copyable";
import { ComponentComparison } from "@/components/site/component-comparison";
import { Preview } from "@/components/site/preview";
import {
  TIER_BUDGETS,
  TIER_LABELS,
  components,
  dependentsOf,
  getItem,
  installCommand,
  resolveDependencies,
} from "@/lib/registry";
import { readSource } from "@/lib/source";
import { ASYNC_EXAMPLE, LOCALE_EXAMPLE } from "@/lib/doc-examples";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return components.map((item) => ({ name: item.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const item = getItem(name);

  if (!item || item.type !== "registry:ui") return {};

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/components/${item.name}` },
    openGraph: { title: item.title, description: item.description, url: `/components/${item.name}` },
    twitter: { card: "summary_large_image", title: item.title, description: item.description },
  };
}

const AXES = [
  { icon: "📦", label: "Bundled, minified and gzipped against its tier budget" },
  { icon: "♿", label: "Audited by axe in the state previewed above" },
  { icon: "🖥️", label: "Rendered through react-dom/server with no browser globals" },
  { icon: "🔒", label: "Scanned for network calls, dangerous sinks, and unguarded animation" },
];

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const item = getItem(name);

  if (!item || item.type !== "registry:ui") notFound();

  const source = await readSource(item);
  const dependencies = resolveDependencies(item.name);
  const dependents = dependentsOf(item.name).filter((d) => d.type === "registry:ui");
  const related = components
    .filter((candidate) => candidate.name !== item.name && candidate.category === item.category)
    .slice(0, 3);
  const budget = item.tier ? TIER_BUDGETS[item.tier] : undefined;
  const usage = item.name === "async-boundary" ? ASYNC_EXAMPLE : item.name === "compact-number" ? LOCALE_EXAMPLE : null;

  return (
    <main id="main" className="gear-grid min-h-screen">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-10 pb-20 lg:grid-cols-[12rem_minmax(0,1fr)] lg:px-6">
      <aside className="hidden lg:sticky lg:top-24 lg:flex lg:h-fit lg:flex-col lg:gap-6">
        <div className="border-l border-hairline pl-4">
          <p className="text-caption font-semibold tracking-[0.14em] text-smoke uppercase">On this page</p>
          <div className="mt-3 flex flex-col gap-1">
            {[
              ["preview", "Preview"],
              ["install", "Install"],
              ...(usage ? [["usage", "Usage"]] : []),
              ["source", "Source"],
              ["verification", "Verification"],
              ["related", "Related components"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="-ml-2 rounded-md px-2 py-1.5 text-sm text-smoke transition-colors hover:bg-cream/5 hover:text-cream">
                {label}
              </a>
            ))}
          </div>
        </div>
        <Link href="/components" className="text-sm text-smoke transition-colors hover:text-coral">← Back to library</Link>
      </aside>

      <article className="flex min-w-0 flex-col gap-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-smoke">
        <Link href="/components" className="transition-colors hover:text-cream underline-offset-4 hover:underline">
          Components
        </Link>
        <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <Link href={`/components?category=${encodeURIComponent(item.category ?? "")}`} className="hover:text-coral">{item.category}</Link>
        <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-cream">{item.title}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="break-all font-mono text-[clamp(1.6rem,4vw,2.5rem)] font-semibold tracking-tight text-cream">{item.title}</h1>
          {item.tier && budget && (
            <span className="mt-1 rounded-full bg-coral/10 px-2.5 py-0.5 text-xs font-medium text-coral border border-coral/20">
              {item.tier.toUpperCase()} · {budget}B gzip budget
            </span>
          )}
        </div>
        <p className="max-w-3xl text-body-lg text-smoke">{item.description}</p>

        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-smoke">Category</dt>
            <dd className="font-medium text-cream">{item.category}</dd>
          </div>

          {item.tier && budget && (
            <div className="flex gap-2">
              <dt className="text-smoke">Budget</dt>
              <dd>
                <span className="font-mono">{item.tier}</span>, {TIER_LABELS[item.tier]}
              </dd>
            </div>
          )}

          <div className="flex gap-2">
            <dt className="text-smoke">External runtime</dt>
            <dd className="font-medium text-coral">React / React DOM only</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2 pt-1" aria-label="Automated checks included">
          {["axe fixture", "SSR render", "source scan", "bundle budget"].map((label) => (
            <span key={label} className="rounded-full border border-coral/25 bg-coral/10 px-2.5 py-1 text-caption font-medium text-coral">
              {label}
            </span>
          ))}
        </div>
      </header>

      <section id="preview" className="scroll-mt-28 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-cream">Preview</h2>
          <span className="text-caption tracking-[0.14em] text-coral uppercase">Live fixture</span>
        </div>
        <div className="rounded-xl border border-hairline bg-anvil p-3 sm:p-6">
          <Preview name={item.name} showControls />
        </div>
        <p className="text-sm text-smoke">
          Try the component here. Locale-aware formatting and direction follow the selected language;
          example content and labels are not automatically translated. Overlay demos use interactive launchers.
        </p>
      </section>

      <ComponentComparison name={item.name} />

      <section id="install" className="scroll-mt-28 flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-cream">Install</h2>
        <div className="rounded-xl border border-hairline bg-anvil p-4">
          <Copyable value={installCommand(item.name)} label="Copy install command" />
        </div>
        <p className="text-sm text-smoke">
          Copies the source into your project.
          {dependencies.length > 0 && (
            <>
              {" "}
              Pulls in {dependencies.length}{" "}
              {dependencies.length === 1 ? "shared registry item" : "shared registry items"}:{" "}
              <span className="font-mono">{dependencies.join(", ")}</span>.
            </>
          )}
        </p>
        <Link href="/getting-started" className="text-sm text-coral underline-offset-4 hover:underline">New here? Set up Tailwind and import aliases first →</Link>
      </section>

      {usage && <section id="usage" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-cream">Usage</h2>
        <Copyable value={usage} label={`Copy ${item.title} example`} block />
      </section>}

      <section id="source" className="scroll-mt-28 flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-cream">Source &amp; props</h2>
          <a href={`${siteConfig.repo}/blob/main/${item.files[0].path}`} className="text-xs text-coral hover:underline">Edit on GitHub ↗</a>
        </div>
        <p className="text-sm text-smoke">Prop types and inline documentation are included below. This is repository source; the installer rewrites shared imports for your project.</p>
        <div className="rounded-xl border border-hairline bg-anvil p-4">
          <Copyable value={source} label={`Copy ${item.title} source`} block />
        </div>
      </section>

      <section id="verification" className="scroll-mt-28 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-cream">What CI checks</h2>
          <span className="text-caption tracking-[0.14em] text-coral uppercase">Quality contract</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {AXES.map((axis) => (
            <li key={axis.label} className="flex items-start gap-3 rounded-lg border border-hairline bg-anvil p-3">
              <span className="text-lg" aria-hidden="true">{axis.icon}</span>
              <span className="text-sm text-smoke">{axis.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {dependents.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-cream">Used by</h2>
          <div className="flex flex-wrap gap-2">
            {dependents.map((dependent) => (
              <Link
                key={dependent.name}
                href={`/components/${dependent.name}`}
                className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-smoke transition-colors hover:border-coral hover:text-coral"
              >
                {dependent.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section id="related" className="scroll-mt-28 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-cream">Related components</h2>
            <Link href={`/components?category=${encodeURIComponent(item.category ?? "")}`} className="text-caption font-medium text-coral hover:underline">Browse category ↗</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((candidate) => (
              <Link
                key={candidate.name}
                href={`/components/${candidate.name}`}
                className="group rounded-xl border border-hairline bg-anvil p-4 transition-all hover:-translate-y-0.5 hover:border-coral/50 hover:shadow-lg"
              >
                <p className="font-mono text-sm font-semibold text-cream group-hover:text-coral">{candidate.title}</p>
                <p className="mt-2 line-clamp-2 text-caption text-smoke">{candidate.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex items-center gap-4 border-t border-hairline pt-8">
        <Link
          href="/components"
          className="text-sm text-smoke transition-colors hover:text-cream"
        >
          &larr; All components
        </Link>
      </div>
      </article>
      </div>
    </main>
  );
}
