import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/site/hero";
import { RecoveryLab } from "@/components/site/recovery-lab";
import { ComparisonGrid } from "@/components/site/comparison";
import { COMPARISONS } from "@/components/site/comparisons";
import { Copyable } from "@/components/site/copyable";
import { components, componentsByCategory, installCommand } from "@/lib/registry";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const STARTERS = [
  { name: "async-boundary", number: "01", title: "A request will fail.", body: "Give loading, empty, error, and ready states a place in your interface.", code: '<AsyncBoundary status="error" />', tag: "Loading & recovery" },
  { name: "resilient-form", number: "02", title: "Keep the work they typed.", body: "Save allowed drafts locally and help people recover from a rejected submission.", code: '<ResilientForm formKey="contact" />', tag: "Forms & drafts" },
  { name: "command-palette", number: "03", title: "Let the keyboard lead.", body: "Search, move through results, and jump straight to the right place.", code: "<CommandPalette commands={commands} />", tag: "Keyboard navigation" },
  { name: "currency-field", number: "04", title: "Numbers need context.", body: "Parse and display currency using the conventions of the selected locale.", code: '<CurrencyField currency="EUR" />', tag: "Internationalisation" },
];

const CHECKS = [
  { title: "Bundle budgets", body: "Every registry item is bundled and gzipped against its declared size ceiling.", file: "budget.test.ts" },
  { title: "Accessible fixtures", body: "Each documented component fixture is rendered and checked with axe.", file: "conformance.test.tsx" },
  { title: "Server rendering", body: "Component fixtures are rendered with react-dom/server to catch browser-only assumptions.", file: "ssr.test.tsx" },
  { title: "Locale behaviour", body: "Tests cover direction, calendars, numerals, and locale-aware form handling.", file: "locale.test.ts" },
];

const FAQS = [
  { question: "Is Gear5 UI free for commercial projects?", answer: "Yes. The source is MIT licensed, including commercial use. Keep the copyright and licence notice with copies or substantial portions of the software." },
  { question: "Is this a package I need to keep upgrading?", answer: "No. The shadcn CLI copies the component and its shared helpers into your project. You own those files and choose which future changes to adopt. React, React DOM, and Tailwind CSS are prerequisites." },
  { question: "Does it work outside Next.js?", answer: "The registry components do not import Next.js. They are React source files styled with Tailwind CSS. This documentation site uses Next.js, but your application does not have to." },
  { question: "Do components translate themselves?", answer: "LocaleProvider controls formatting and writing direction where a component supports them. You supply translated labels and application content. Changing a locale is not an automatic translation service." },
  { question: "Will forms submit automatically when I reconnect?", answer: "No. ResilientForm preserves permitted drafts locally and asks the user to submit again. Reliable background delivery and duplicate prevention need an application-owned queue and an idempotent server endpoint." },
  { question: "What should I test before shipping?", answer: "Test your own content, labels, keyboard flows, screen readers, target browsers, and server integration. The library's automated checks are a useful baseline, not an accessibility certification or a guarantee about your complete application." },
];

export default function Home() {
  const categories = componentsByCategory();
  return (
    <main id="main">
      <Hero />
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Start with a real problem</p>
            <h2 className="section-heading">The little details.<br />The difference people feel.</h2>
          </div>
          <Link href="/components" className="w-fit text-sm text-smoke underline-offset-4 hover:text-coral hover:underline">All {components.length} components <span aria-hidden="true">↗</span></Link>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STARTERS.map((item) => (
            <li key={item.name} className="group flex flex-col rounded-xl border border-hairline bg-anvil transition-colors hover:border-coral/50">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4"><span className="font-mono text-xs text-coral">{item.number}</span><span className="text-xs text-smoke">{item.tag}</span></div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-medium tracking-tight text-cream"><Link href={`/components/${item.name}`} className="underline-offset-4 hover:underline">{item.title}</Link></h3>
                <p className="mt-3 text-sm leading-relaxed text-smoke">{item.body}</p>
                <p className="mt-6 border-t border-hairline pt-4 font-mono text-[11px] leading-relaxed break-words text-coral">{item.code}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="recovery" className="border-y border-hairline bg-anvil/40">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Break it. Then recover.</p>
            <h2 className="section-heading">A failed request should not mean starting over.</h2>
            <p className="mt-4 text-base leading-relaxed text-smoke">Type a sample answer, choose a response, and submit. See what happens to the draft when the connection drops or a session expires.</p>
          </div>
          <div className="mt-10"><RecoveryLab /></div>
          <Link href="/components/resilient-form" className="mt-5 inline-flex items-center gap-2 text-sm text-smoke hover:text-coral">Read the ResilientForm docs <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Beyond English defaults</p>
          <h2 className="section-heading">Same value. Different context.</h2>
          <p className="mt-4 text-base leading-relaxed text-smoke">These examples compare a simple formatting shortcut with a locale-aware component. Both sides are computed in your browser.</p>
        </div>
        <div className="mt-10"><ComparisonGrid comparisons={COMPARISONS} /></div>
      </section>

      <section className="border-y border-hairline bg-anvil">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">Check the receipts</p>
            <h2 className="section-heading">Source you can read.<br />Checks you can run.</h2>
            <p className="mt-4 text-sm leading-relaxed text-smoke">Size budgets, accessibility fixtures, SSR, and source scans run in CI. Your application still needs testing with its own content and users.</p>
            <a href={`${siteConfig.repo}/actions/workflows/ci.yml`} className="button-secondary mt-6">View CI results <span aria-hidden="true">↗</span></a>
          </div>
          <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {CHECKS.map((check) => <li key={check.title} className="border-t border-hairline pt-4"><h3 className="text-base font-medium text-cream">{check.title}</h3><p className="mt-2 text-sm leading-relaxed text-smoke">{check.body}</p><a href={`${siteConfig.repo}/blob/main/tests/${check.file}`} className="mt-3 inline-block font-mono text-xs text-coral underline-offset-4 hover:underline">Read the tests ↗</a></li>)}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow mb-4">The collection</p><h2 className="section-heading">Find your next building block.</h2></div>
          <p className="text-sm text-smoke">{components.length} components · {categories.length} categories</p>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((group) => <li key={group.category}><Link href={`/components?category=${encodeURIComponent(group.category)}`} className="group flex h-full items-center justify-between gap-4 rounded-lg border border-hairline bg-anvil p-5 transition-colors hover:border-coral/50"><span><span className="block text-sm font-medium text-cream">{group.category}</span><span className="mt-1 block text-xs text-smoke">{group.items.length} components</span></span><span aria-hidden="true" className="text-smoke group-hover:text-coral">↗</span></Link></li>)}
        </ul>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 border-t border-hairline px-5 py-16 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div><p className="eyebrow mb-4">A few good questions</p><h2 className="section-heading">Before you install.</h2><p className="mt-4 text-sm text-smoke">Need something else? <a href={`${siteConfig.repo}/issues`} className="text-coral underline-offset-4 hover:underline">Open an issue.</a></p></div>
        <div className="divide-y divide-hairline border-y border-hairline">
          {FAQS.map((faq) => <details key={faq.question} className="group py-5"><summary className="cursor-pointer text-sm font-medium text-cream">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-smoke">{faq.answer}</p></details>)}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pt-6 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-coral/25 bg-coral/[0.06] p-7 sm:p-12">
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div><p className="eyebrow mb-4">Your source. Your next idea.</p><h2 className="section-heading">Take one. Build something.</h2><p className="mt-4 text-sm text-smoke">No account, no subscription. Just code in your project.</p></div>
            <div><Copyable value={installCommand("async-boundary")} label="Copy starter install command" /><Link href="/getting-started" className="mt-4 inline-block text-sm text-coral underline-offset-4 hover:underline">Installation guide <span aria-hidden="true">→</span></Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
