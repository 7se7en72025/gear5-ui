"use client";

import { useState } from "react";
import { clearDraft } from "@/registry/gear5/lib/draft-storage";
import { Field } from "@/registry/gear5/ui/field";
import { ResilientForm, type SubmissionState } from "@/registry/gear5/ui/resilient-form";

type Scenario = "confirmed" | "validation" | "uncertain" | "session";

const SCENARIOS: Array<{ value: Scenario; label: string }> = [
  { value: "confirmed", label: "Submission confirmed" },
  { value: "validation", label: "Server found an issue" },
  { value: "uncertain", label: "Connection interrupted" },
  { value: "session", label: "Session expired" },
];

const STATE_LABELS: Record<SubmissionState, string> = {
  idle: "Draft will save as you type",
  "draft-restored": "Draft restored from this device",
  sending: "Simulating a submission…",
  "saved-offline": "Draft saved. Reconnect before submitting",
  "needs-attention": "Submission needs your attention",
  sent: "Demo submission confirmed",
};

export function RecoveryLab() {
  const [scenario, setScenario] = useState<Scenario>("confirmed");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SubmissionState>("idle");
  const [reauth, setReauth] = useState(false);
  const [formVersion, setFormVersion] = useState(0);

  async function submit(data: FormData) {
    setErrors({});
    setReauth(false);

    if (!String(data.get("email") ?? "").trim()) {
      setErrors({ email: "Enter a sample email address to try this demo." });
      throw new Error("A sample email is required.");
    }

    if (scenario === "validation") {
      setErrors({ email: "This is a simulated server error. Choose “Submission confirmed” to continue." });
      throw new Error("The server rejected one or more fields.");
    }

    if (scenario === "session") {
      setReauth(true);
      throw new Error("The session expired before the server confirmed the application.");
    }

    if (scenario === "uncertain") {
      throw new Error("The connection closed before the server response arrived.");
    }

    await new Promise((resolve) => window.setTimeout(resolve, 350));
    if (!data.get("email")) throw new Error("Email is required.");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-anvil shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-hairline px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-caption font-semibold tracking-[0.14em] text-coral uppercase">Recovery lab</p>
          <p className="mt-1 text-sm text-smoke">A local simulation. No application or email is sent.</p>
        </div>
        <span className="rounded-full border border-coral/25 bg-coral/10 px-3 py-1.5 text-caption font-medium text-coral">
          {STATE_LABELS[state]}
        </span>
      </div>

      <div className="grid lg:grid-cols-[.8fr_1.2fr]">
        <div className="border-b border-hairline bg-canvas/40 p-5 lg:border-e lg:border-b-0">
          <fieldset>
          <legend className="text-sm font-semibold text-cream">Choose a response</legend>
          <div className="mt-4 flex flex-col gap-2">
            {SCENARIOS.map((item) => (
              <label key={item.value} className={scenario === item.value ? "cursor-pointer rounded-lg border border-coral/45 bg-coral/10 p-3 text-sm text-cream focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-coral" : "cursor-pointer rounded-lg border border-hairline p-3 text-sm text-smoke transition-colors hover:border-cream/35 hover:text-cream focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-coral"}>
                <input
                  type="radio"
                  name="recovery-scenario"
                  value={item.value}
                  checked={scenario === item.value}
                  onChange={() => { setScenario(item.value); setErrors({}); setReauth(false); }}
                  disabled={state === "sending"}
                  className="me-2 accent-coral"
                />
                {item.label}
              </label>
            ))}
          </div>
          </fieldset>
          <p className="mt-5 text-caption leading-5 text-smoke">
            An interrupted request is intentionally not labelled “failed”. The server may have received it, so the product must check before retrying.
          </p>
        </div>

        <div className="p-5 sm:p-7">
          {reauth && (
            <div className="mb-5 rounded-lg border border-coral/30 bg-coral/10 p-4">
              <p className="text-sm font-semibold text-cream">Your session ended</p>
              <p className="mt-1 text-sm text-smoke">Simulate signing back in, then submit the same answers again.</p>
              <button type="button" onClick={() => { setReauth(false); setScenario("confirmed"); }} className="mt-3 rounded-md border border-coral/40 px-3 py-1.5 text-sm font-medium text-coral hover:bg-coral/10">
                Simulate sign-in
              </button>
            </div>
          )}

          <ResilientForm
            key={formVersion}
            formKey="gear5-application-lab"
            errors={errors}
            onSubmit={submit}
            onSubmissionStateChange={setState}
          >
            <Field name="email" type="email" label="Sample email" placeholder="you@example.com" autoComplete="off" description="Use made-up details. This demo saves them in this browser." error={errors.email} required />
            <Field name="context" label="What are you building?" multiline rows={4} description="Try typing here, then refresh the page to restore this draft." />
            <button type="submit" className="self-start rounded-md bg-coral px-4 py-2.5 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5">
              Test submission
            </button>
          </ResilientForm>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            <p className="text-xs text-smoke">Do not enter sensitive information.</p>
            <button type="button" disabled={state === "sending"} onClick={() => { clearDraft("gear5-application-lab"); setErrors({}); setReauth(false); setState("idle"); setFormVersion((value) => value + 1); }} className="min-h-9 text-xs text-coral underline-offset-4 hover:underline disabled:opacity-50">Clear demo draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}
