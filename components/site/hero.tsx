import Link from "next/link";
import { components, installCommand } from "@/lib/registry";
import { HeroDemo } from "./hero-demo";
import { Copyable } from "./copyable";

export function Hero() {
  return (
    <section className="gear-grid relative isolate overflow-hidden border-b border-hairline">
      <div aria-hidden="true" className="hero-orb absolute -top-48 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full" />
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14 lg:py-24">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="eyebrow animate-fade-in-up flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
            Open source. Yours to build with.
          </p>
          <h1 className="animate-fade-in-up text-balance text-[clamp(3rem,6.1vw,5.4rem)] leading-[1.02] tracking-[-0.065em] text-cream">
            Good interfaces.<br />Even on a <span className="whitespace-nowrap font-editorial italic text-coral">bad day.</span>
          </h1>
          <p className="max-w-lg text-pretty text-lg leading-relaxed text-smoke">
            {components.length} React components for slow connections, different languages, and people who navigate by keyboard. Copy the source. Make it yours.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/components" className="button-primary">Explore components <span aria-hidden="true">↗</span></Link>
            <Link href="/getting-started" className="button-secondary">Get started <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-2 max-w-lg">
            <p className="mb-2 font-mono text-xs text-smoke">One command. Source in your project.</p>
            <Copyable value={installCommand("async-boundary")} label="Copy AsyncBoundary install command" />
          </div>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-smoke">
            <span>React + Tailwind CSS</span><span>MIT licensed</span><span>No extra runtime packages</span>
          </p>
        </div>
        <HeroDemo />
      </div>
      <div className="border-t border-hairline bg-anvil/60">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 text-xs text-smoke sm:px-6">
          <p>Built for the states between the happy paths.</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2 font-mono"><span>01 / Accessible</span><span>02 / Locale-aware</span><span>03 / Source-owned</span></p>
        </div>
      </div>
    </section>
  );
}
