"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CommandPalette } from "@/registry/gear5/ui/command-palette";
import { Kbd } from "@/registry/gear5/ui/kbd";

export interface PaletteItem {
  name: string;
  title: string;
  category: string;
}

/**
 * The library's own CommandPalette, driving the site that documents it.
 *
 * The component index and keyboard shortcut stay available on every page.
 * It is also the honest test of the component: if a keyboard-first launcher
 * cannot survive being the primary way around its own documentation, it is not
 * finished.
 */
export function SiteCommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commands = useMemo(
    () =>
      [{ id: "getting-started", label: "Getting started · Installation guide", onRun: () => { setOpen(false); router.push("/getting-started"); } }, ...items.map((item) => ({
        id: item.name,
        // Category in the label so it is searchable too. Typing "overlay"
        // should find Dialog even though the word is not in its name.
        label: `${item.title} · ${item.category}`,
        onRun: () => {
          setOpen(false);
          router.push(`/components/${item.name}`);
        },
      }))],
    [items, router],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search components"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-md border border-hairline px-2 py-1.5 text-body-sm text-smoke transition-colors hover:text-cream xl:px-3"
      >
        <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
        <span className="hidden xl:inline">Search</span>
        <span className="hidden xl:inline"><Kbd>⌘ / Ctrl K</Kbd></span>
      </button>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
        label="Search components"
        placeholder={`Search ${items.length} components...`}
      />
    </>
  );
}
