import type { Metadata } from "next";
import Link from "next/link";
import { Copyable } from "@/components/site/copyable";
import { ASYNC_EXAMPLE, LOCALE_EXAMPLE } from "@/lib/doc-examples";
import { installCommand } from "@/lib/registry";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Getting started",
  description: "Install your first Gear5 UI component, configure Tailwind and import aliases, and adapt it to your application's language and theme.",
  alternates: { canonical: "/getting-started" },
};

const SECTIONS = [["requirements", "Before you begin"], ["install", "Install a component"], ["use", "Make it work"], ["locale", "Language & direction"], ["theme", "Styling & dark mode"], ["shipping", "Before you ship"]] as const;

export default function GettingStarted() {
  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 pb-24 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
        <nav aria-label="Getting started sections"><p className="eyebrow mb-5">Getting started</p><ul className="space-y-3">{SECTIONS.map(([id, label]) => <li key={id}><a href={`#${id}`} className="text-sm text-smoke hover:text-coral">{label}</a></li>)}</ul></nav>
        <Link href="/components" className="mt-7 inline-block border-t border-hairline pt-5 text-sm text-coral">Explore the library →</Link>
      </aside>
      <article className="flex min-w-0 max-w-3xl flex-col gap-12">
        <header><p className="eyebrow mb-4">From preview to your project</p><h1 className="section-heading text-[clamp(2.5rem,5vw,4rem)]">Your first component.</h1><p className="mt-5 text-lg leading-relaxed text-smoke">Gear5 UI is a collection of source files, not a hosted service. Install just what you need, then edit it like the rest of your code.</p></header>
        <section id="requirements" className="space-y-4">
          <h2 className="text-2xl tracking-tight text-cream">01. Before you begin</h2>
          <p className="text-sm leading-relaxed text-smoke">Start with a React application and Tailwind CSS. This repository is tested with React 19 and Tailwind CSS 4. The components have no Next.js imports, so Next.js is optional for consumers.</p>
          <div className="rounded-xl border border-hairline bg-anvil p-5 text-sm leading-relaxed text-smoke"><p className="font-medium text-cream">Already using the shadcn CLI?</p><p className="mt-2">Keep your existing configuration and skip to step 2. Otherwise initialise it from your application directory:</p><div className="mt-4"><Copyable value="npx shadcn@latest init" label="Copy shadcn initialization command" /></div><p className="mt-3">This configures your project and can add dependencies or update CSS. Commit existing work first, review the changes, and follow the <a href="https://ui.shadcn.com/docs/cli" className="text-coral underline-offset-4 hover:underline">official CLI guide</a> for your framework.</p></div>
          <p className="text-sm leading-relaxed text-smoke">The generated Gear5 imports use <code className="text-cream">@/components/gear5</code> and <code className="text-cream">@/lib/gear5</code>. Make sure <code className="text-cream">@/*</code> resolves to the directory containing those folders. Review your <a href="https://ui.shadcn.com/docs/components-json" className="text-coral underline-offset-4 hover:underline">components.json configuration</a> if your project uses a different layout.</p>
        </section>
        <section id="install" className="space-y-4">
          <h2 className="text-2xl tracking-tight text-cream">02. Install a component</h2>
          <p className="text-sm leading-relaxed text-smoke">Run this in your application directory. The registry includes the source and its shared Gear5 helpers.</p>
          <Copyable value={installCommand("async-boundary")} label="Copy AsyncBoundary install command" />
          <p className="text-sm leading-relaxed text-smoke">For this example, you will get the component plus helpers for class names, announcements, network state, and locale information. They are source files in your repo, not extra runtime packages.</p>
          <p className="rounded-lg border-s-2 border-coral bg-coral/5 p-4 text-sm leading-relaxed text-smoke">Already customised a file? Review the diff before replacing it. You choose when to adopt upstream changes.</p>
        </section>
        <section id="use" className="space-y-4">
          <h2 className="text-2xl tracking-tight text-cream">03. Make it work</h2>
          <p className="text-sm leading-relaxed text-smoke">This self-contained example simulates an error and recovers when you press retry. In your application, connect status and retry to your own data layer.</p>
          <Copyable value={ASYNC_EXAMPLE} label="Copy runnable AsyncBoundary example" block />
          <p className="text-sm leading-relaxed text-smoke">Interactive components use React hooks. In an App Router project, keep event handlers inside a Client Component, as shown above. <Link href="/components/async-boundary" className="text-coral hover:underline">View all AsyncBoundary props and source →</Link></p>
        </section>
        <section id="locale" className="space-y-4">
          <h2 className="text-2xl tracking-tight text-cream">04. Language and direction</h2>
          <p className="text-sm leading-relaxed text-smoke">Install a formatting component, then pass an explicit locale. Its shared LocaleProvider helper is included. Resolve the same locale on the server and client to avoid hydration differences.</p>
          <Copyable value={installCommand("compact-number")} label="Copy CompactNumber install command" />
          <Copyable value={LOCALE_EXAMPLE} label="Copy Arabic locale example" block />
          <p className="text-sm leading-relaxed text-smoke">The provider supplies locale facts to components that consume them. It does not translate text or change your document attributes. Supply translated labels, and set <code>lang</code> and <code>dir</code> on your app or the relevant region.</p>
        </section>
        <section id="theme" className="space-y-4">
          <h2 className="text-2xl tracking-tight text-cream">05. Styling and dark mode</h2>
          <p className="text-sm leading-relaxed text-smoke">Components use Tailwind utilities and accept className where supported. Keep the installed files within Tailwind&apos;s scanned source directories. The docs site&apos;s gold palette is custom styling, not a requirement.</p>
          <p className="text-sm leading-relaxed text-smoke">For class-based dark mode with Tailwind 4, include this in your application&apos;s global CSS:</p>
          <Copyable value={'@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));\n\n/* Gear5 controls use this foreground token on accent fills.\n   Choose colours with sufficient contrast for your theme. */\n@theme {\n  --color-on-accent: #ffffff;\n}'} label="Copy Tailwind theme configuration" block />
          <p className="text-sm leading-relaxed text-smoke">Add the <code>dark</code> class to your document root or use <Link href="/components/theme-toggle" className="text-coral hover:underline">ThemeToggle</Link>. If you change the accent background, check its contrast with <code>text-on-accent</code>.</p>
        </section>
        <section id="shipping" className="space-y-4">
          <h2 className="text-2xl tracking-tight text-cream">06. Before you ship</h2>
          <ul className="list-disc space-y-3 ps-5 text-sm leading-relaxed text-smoke">
            <li>Test your labels and content with keyboard navigation, a screen reader, and the locales your users need.</li>
            <li>For draft persistence, use a formKey scoped to the signed-in user, clear it on sign-out, and mark sensitive fields with <code>data-no-persist</code>. Use <code>persistDraft=&#123;false&#125;</code> when storage is inappropriate.</li>
            <li>Do not treat a lost response as a failed transaction. Safe retries need a server-side idempotency contract.</li>
            <li>Automated fixture checks are a baseline. Re-run checks after changing components or integrating them into your application.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-4"><Link href="/components" className="button-primary">Find your next component ↗</Link><a href={`${siteConfig.repo}/issues`} className="button-secondary">Report an issue</a></div>
        </section>
      </article>
    </main>
  );
}
