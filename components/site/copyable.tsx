"use client";

import { useEffect, useRef, useState } from "react";
import { announce } from "@/registry/gear5/lib/announce";

export interface CopyableProps {
  /** The exact text placed on the clipboard. */
  value: string;
  /** Accessible name for the copy control, e.g. "Copy install command". */
  label: string;
  /** Render the value as a scrollable block rather than a single line. */
  block?: boolean;
}

/**
 * A code snippet with a copy button.
 *
 * The clipboard write is the one place this site touches a browser capability
 * the registry's own privacy rules forbid components from using — it lives
 * here, in site chrome, rather than inside any shipped component.
 */
export function Copyable({ value, label, block = false }: CopyableProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    setCopied(false);
    setError(false);
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setError(true);
      announce("Clipboard unavailable. Select the code and copy it manually.", "polite");
      return;
    }

    setCopied(true);
    announce("Copied to clipboard", "polite");

    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <pre
        tabIndex={0}
        aria-label={label.replace(/^Copy /i, "")}
        className={`overflow-x-auto rounded-lg border border-hairline bg-canvas py-4 pe-20 ps-4 font-mono text-xs text-cream ${
          block ? "max-h-[32rem] overflow-y-auto leading-relaxed" : "whitespace-pre leading-6"
        }`}
      >
        <code>{value}</code>
      </pre>

      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="absolute end-2 top-2 rounded-md border border-hairline bg-anvil px-3 py-2 text-xs font-medium text-smoke hover:text-cream"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {error && <p role="status" className="mt-2 text-xs text-smoke">Clipboard unavailable. Select the code and copy it manually.</p>}
    </div>
  );
}
