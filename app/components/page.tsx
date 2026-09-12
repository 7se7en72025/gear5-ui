import type { Metadata } from "next";
import { ComponentBrowser } from "@/components/site/component-browser";
import { components, componentsByCategory } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${components.length} Gear5 UI components, with live previews. The same fixtures the conformance suite renders in CI.`,
};

export default function ComponentsPage() {
  const categories = componentsByCategory().map((group) => group.category);

  const items = components.map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    category: item.category ?? "Uncategorised",
    tier: item.tier,
  }));

  return (
    <main id="main" className="gear-grid min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 sm:px-6">
        <header className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-hairline bg-anvil/75 p-7 shadow-2xl shadow-black/10 sm:p-10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 size-64 rounded-full bg-coral/10 blur-3xl" />
          <div className="relative flex max-w-3xl flex-col gap-4">
            <p className="flex items-center gap-2 text-caption font-medium tracking-[0.16em] text-coral uppercase">
              <span className="size-1.5 rounded-full bg-coral" /> Registry explorer
            </p>
            <h1 className="text-balance text-heading font-semibold text-cream">Find a component. See it work.</h1>
            <p className="max-w-2xl text-body text-smoke">
              Browse {components.length} components for forms, navigation, data, feedback, and global
              interfaces. Each live preview uses the same fixture checked for accessibility and SSR in CI.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-caption text-smoke">
              <span><strong className="font-semibold text-cream">{components.length}</strong> components</span>
              <span><strong className="font-semibold text-cream">{categories.length}</strong> categories</span>
              <span><strong className="font-semibold text-cream">0</strong> runtime dependencies</span>
            </div>
          </div>
        </header>

        <ComponentBrowser items={items} categories={categories} />
      </div>
    </main>
  );
}
