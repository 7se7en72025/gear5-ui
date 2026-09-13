"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AsyncBoundary, type AsyncStatus } from "@/registry/gear5/ui/async-boundary";
import { CompactNumber } from "@/registry/gear5/ui/compact-number";
import { LocaleProvider } from "@/registry/gear5/lib/use-locale";

const LOCALES = {
  "en-US": { name: "English", dir: "ltr", heading: "Your workspace", members: "visitors this month", tasks: ["Review the first draft", "Make room for every language", "Ship something useful"], loading: "Opening your workspace…", error: "The connection dropped. Give it another try.", empty: "A fresh start. Your first project belongs here.", retry: "Try again", ready: "Workspace loaded" },
  "hi-IN": { name: "हिन्दी", dir: "ltr", heading: "आपका कार्यक्षेत्र", members: "इस महीने के विज़िटर", tasks: ["पहले ड्राफ्ट की समीक्षा करें", "हर भाषा के लिए जगह बनाएं", "कुछ उपयोगी बनाएं"], loading: "आपका कार्यक्षेत्र खुल रहा है…", error: "कनेक्शन टूट गया। फिर से कोशिश करें।", empty: "एक नई शुरुआत। आपका पहला प्रोजेक्ट यहाँ दिखेगा।", retry: "फिर से कोशिश करें", ready: "कार्यक्षेत्र लोड हो गया" },
  "ar-EG": { name: "العربية", dir: "rtl", heading: "مساحة عملك", members: "زائر هذا الشهر", tasks: ["راجع المسودة الأولى", "أفسح المجال لكل لغة", "أنشئ شيئًا مفيدًا"], loading: "جارٍ فتح مساحة العمل…", error: "انقطع الاتصال. حاول مرة أخرى.", empty: "بداية جديدة. سيظهر مشروعك الأول هنا.", retry: "حاول مرة أخرى", ready: "تم تحميل مساحة العمل" },
} as const;

const STATES: AsyncStatus[] = ["ready", "loading", "empty", "error"];

export function HeroDemo() {
  const [status, setStatus] = useState<AsyncStatus>("ready");
  const [locale, setLocale] = useState<keyof typeof LOCALES>("en-US");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copy = LOCALES[locale];
  useEffect(() => () => clearTimeout(timer.current), []);

  function selectState(next: AsyncStatus) {
    clearTimeout(timer.current);
    setStatus(next);
  }

  function retry() {
    selectState("loading");
    timer.current = setTimeout(() => setStatus("ready"), 750);
  }

  return (
    <div className="relative min-w-0">
      <div aria-hidden="true" className="absolute -inset-3 -z-10 rotate-2 rounded-2xl border border-coral/15 bg-coral/[0.03]" />
      <section aria-label="Interactive component demo" className="overflow-hidden rounded-2xl border border-hairline bg-anvil shadow-xl shadow-black/10">
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <p className="font-mono text-xs text-smoke">playground.tsx</p>
          <span className="flex items-center gap-2 text-xs text-coral"><span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />Live component</span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-cream">Try a different state</p>
            <label className="flex items-center gap-2 text-xs text-smoke">
              <span className="sr-only">Demo language</span>
              <select value={locale} onChange={(e) => setLocale(e.target.value as keyof typeof LOCALES)} className="min-h-9 rounded-md border border-hairline bg-canvas px-2 text-sm text-cream">
                {Object.entries(LOCALES).map(([tag, item]) => <option key={tag} value={tag} lang={tag}>{item.name}</option>)}
              </select>
            </label>
          </div>
          <div role="group" aria-label="Demo state" className="mb-5 grid grid-cols-4 gap-1 rounded-lg border border-hairline bg-canvas p-1">
            {STATES.map((value) => <button key={value} type="button" aria-pressed={status === value} onClick={() => selectState(value)} className={`min-h-10 rounded-md text-xs font-medium capitalize transition-colors ${status === value ? "bg-coral text-on-accent" : "text-smoke hover:text-cream"}`}>{value}</button>)}
          </div>
          <LocaleProvider locale={locale}>
            <div lang={locale} dir={copy.dir} className="min-h-[17rem] rounded-xl border border-hairline bg-canvas p-4 sm:p-5">
              <AsyncBoundary status={status} onRetry={retry} labels={{ ...copy, offline: copy.error }} minHeight="14rem">
                <div className="mb-5 flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-cream">{copy.heading}</h2>
                  <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full border border-coral/25 bg-coral/10 font-mono text-xs text-coral">G5</span>
                </div>
                <ul className="space-y-2">
                  {copy.tasks.map((task, index) => <li key={task} className="flex items-center gap-3 rounded-lg border border-hairline bg-anvil px-3 py-3 text-sm text-cream"><span aria-hidden="true" className={`flex size-4 shrink-0 items-center justify-center rounded border text-[10px] ${index === 0 ? "border-coral bg-coral text-on-accent" : "border-hairline"}`}>{index === 0 ? "✓" : ""}</span>{task}</li>)}
                </ul>
                <p className="mt-5 text-xs text-smoke"><span className="font-mono font-semibold text-cream"><CompactNumber value={1234567} /></span> {copy.members}</p>
              </AsyncBoundary>
            </div>
          </LocaleProvider>
          <p className="mt-4 text-xs leading-relaxed text-smoke">A local simulation. Change the state or language to see the actual component respond. No requests are sent.</p>
        </div>
        <Link href="/components/async-boundary" className="flex items-center justify-between border-t border-hairline bg-canvas/40 px-5 py-4 text-sm text-smoke transition-colors hover:text-coral"><span>Built with <span className="font-mono text-xs text-cream">AsyncBoundary</span></span><span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
