import Link from "next/link";
import { CompactNumber } from "@/registry/gear5/ui/compact-number";
import { DateRangeText } from "@/registry/gear5/ui/date-range-text";
import { LocaleProvider } from "@/registry/gear5/lib/use-locale";

const SAMPLE_LOCALES = [
  { tag: "en-US", name: "English" },
  { tag: "hi-IN", name: "हिन्दी" },
  { tag: "ar-EG", name: "العربية" },
] as const;

const RANGE_START = new Date("2026-01-01T00:00:00Z");
const RANGE_END = new Date("2026-01-05T00:00:00Z");

function LocaleRow({ tag, name }: { tag: string; name: string }) {
  return (
    <LocaleProvider locale={tag}>
      <div className="flex items-baseline justify-between gap-4 border-t border-hairline py-2 first:border-t-0 first:pt-0">
        <span className="shrink-0 text-caption text-smoke" lang={tag}>
          {name}
        </span>
        <span className="text-end text-body-sm text-cream">
          <CompactNumber value={1234567} exactLabel={false} />
          <span className="mx-2 text-smoke/50" aria-hidden="true">
            ·
          </span>
          <DateRangeText start={RANGE_START} end={RANGE_END} options={{ dateStyle: "medium" }} />
        </span>
      </div>
    </LocaleProvider>
  );
}

export function Hero() {
  return (
    <section className="gear-grid relative isolate overflow-hidden border-b border-hairline">
      <div aria-hidden="true" className="hero-orb absolute -top-48 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full" />
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
        <div className="flex max-w-2xl flex-col gap-7">
          <div className="animate-fade-in-up flex items-center gap-3 text-caption font-medium tracking-[0.14em] text-coral uppercase">
            <span className="size-2 rounded-full bg-coral shadow-[0_0_18px_var(--color-ember-coral)]" />
            Gear5 component registry
          </div>

          <h1 className="animate-fade-in-up max-w-3xl text-balance text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[.9] tracking-[-0.07em] text-cream" style={{ animationDelay: "100ms" }}>
            Interfaces that hold up in the <span className="text-coral">real world.</span>
          </h1>

          <p className="animate-fade-in-up max-w-xl text-body-lg text-pretty text-smoke" style={{ animationDelay: "200ms" }}>
            A practical React library for the parts of a product that usually break first: slow
            networks, keyboard flows, locale changes, and failed requests.
          </p>

          <div className="animate-fade-in-up flex flex-wrap items-center gap-3" style={{ animationDelay: "300ms" }}>
            <Link
              href="/components"
              className="rounded-lg bg-coral px-5 py-3 text-body-sm font-semibold text-on-accent transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-coral/25"
            >
              Explore components <span aria-hidden="true">↗</span>
            </Link>

            <a
              href="https://github.com/7se7en72025/gear5-ui"
              className="rounded-lg border border-hairline bg-anvil/60 px-5 py-3 text-body-sm font-medium text-cream transition-colors hover:border-cream/40 hover:bg-cream/10"
            >
              Source on GitHub
            </a>
          </div>

          <div className="animate-fade-in-up mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-smoke" style={{ animationDelay: "400ms" }}>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" aria-hidden="true" />
              866 tests passing
            </span>
            <span aria-hidden="true" className="text-smoke/30">·</span>
            <span>87 components</span>
            <span aria-hidden="true" className="text-smoke/30">·</span>
            <span>Zero dependencies</span>
          </div>
        </div>

        <div className="animate-slide-in-right relative lg:ms-auto lg:w-full" style={{ animationDelay: "300ms" }}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0b12]/85 p-1 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-2 rounded-full bg-[#ec6258]" />
              <span className="size-2 rounded-full bg-[#e9be68]" />
              <span className="size-2 rounded-full bg-[#6bcf98]" />
              <span className="ml-2 font-mono text-xs text-smoke">gear5 / resilience-preview</span>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-caption tracking-[0.14em] text-smoke uppercase">Async boundary</p>
                <div className="mt-5 rounded-lg border border-coral/35 bg-coral/10 p-3">
                  <p className="text-sm font-medium text-cream">Couldn’t load your workspace</p>
                  <p className="mt-1 text-caption text-smoke">Your changes are safe. Try again when you’re ready.</p>
                  <button type="button" className="mt-4 rounded-md bg-coral px-3 py-1.5 text-caption font-bold text-on-accent">Try again</button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-caption text-[#6bcf98]">
                  <span className="size-1.5 rounded-full bg-[#6bcf98]" /> Recovery state ready
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-caption tracking-[0.14em] text-smoke uppercase">Locale matrix</p>
                <div className="mt-4 flex flex-col">
                  {SAMPLE_LOCALES.map((locale) => (
                    <LocaleRow key={locale.tag} tag={locale.tag} name={locale.name} />
                  ))}
                </div>
                <p className="mt-4 border-t border-white/10 pt-3 text-caption text-smoke">Same API. Correct direction, digits, and dates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
