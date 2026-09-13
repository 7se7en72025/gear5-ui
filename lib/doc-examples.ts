/** Runnable, local-only example shared by the guide and component docs. */
export const ASYNC_EXAMPLE = `"use client";

import { useState } from "react";
import { AsyncBoundary } from "@/components/gear5/async-boundary";

export default function Workspace() {
  const [failed, setFailed] = useState(false);

  return (
    <section>
      <button onClick={() => setFailed(true)}>Simulate an error</button>
      <AsyncBoundary
        status={failed ? "error" : "ready"}
        onRetry={() => setFailed(false)}
        minHeight="10rem"
        labels={{ error: "Could not load the workspace.", retry: "Try again" }}
      >
        <p>Your workspace is ready.</p>
      </AsyncBoundary>
    </section>
  );
}`;

export const LOCALE_EXAMPLE = `import { LocaleProvider } from "@/lib/gear5/use-locale";
import { CompactNumber } from "@/components/gear5/compact-number";

export default function Visitors() {
  return (
    <LocaleProvider locale="ar-EG">
      <p lang="ar" dir="rtl">
        <CompactNumber value={1234567} /> زائر
      </p>
    </LocaleProvider>
  );
}`;
