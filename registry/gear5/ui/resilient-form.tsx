"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import {
  applyDraft,
  clearDraft,
  loadDraft,
  readForm,
  saveDraft,
} from "../lib/draft-storage";
import { useLocale } from "../lib/use-locale";
import { useNetwork } from "../lib/use-network";

export interface ResilientFormLabels {
  /** Heading of the error summary, e.g. "There are 2 problems with this form". */
  errorSummary: (count: number) => string;
  /** Shown after a draft is restored from a previous session. */
  draftRestored: string;
  /** Shown when the user submits while offline. */
  savedOffline: string;
  /** Shown when the client cannot confirm whether a request completed. */
  needsAttention: string;
  submitting: string;
}

const DEFAULT_LABELS: ResilientFormLabels = {
  errorSummary: (count) =>
    count === 1 ? "There is 1 problem with this form" : `There are ${count} problems with this form`,
  draftRestored: "We restored what you had typed earlier.",
  savedOffline: "You're offline. Your answers are saved on this device. Reconnect, then submit again.",
  needsAttention: "We could not confirm the submission. Your answers are still saved. Check the result before trying again.",
  submitting: "Sending…",
};

export interface ResilientFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /**
   * Stable key for this form's saved draft. Scope it per user if drafts must
   * not leak between accounts on a shared device, e.g. `checkout:${userId}`.
   */
  formKey: string;
  /**
   * Submit handler. Resolve normally once the server has confirmed the result.
   * Throwing preserves the draft and shows a recovery state. Retrying writes
   * safely requires an idempotency contract on the server.
   */
  onSubmit: (data: FormData) => void | Promise<void>;
  /**
   * Field-level errors, keyed by input `name`. Rendering these is up to your
   * `Field`s; this component turns them into the focusable summary at the top.
   */
  errors?: Record<string, string>;
  labels?: Partial<ResilientFormLabels>;
  /** Turn off draft persistence for forms that should never be recoverable. */
  persistDraft?: boolean;
  /** Receives a user-facing submission state for analytics or surrounding UI. */
  onSubmissionStateChange?: (state: SubmissionState) => void;
  children: React.ReactNode;
}

export type SubmissionState =
  | "idle"
  | "draft-restored"
  | "sending"
  | "saved-offline"
  | "needs-attention"
  | "sent";

/**
 * A form that survives the conditions most forms are never tested against.
 *
 * - **Drafts persist locally** as the user types, so a crash, a backgrounded
 *   tab, or a dead battery does not erase their work. Passwords, payment
 *   fields, and anything marked `data-no-persist` are excluded.
 * - **Submitting while offline preserves the draft** and explains the next
 *   safe action. A library cannot promise a durable retry without a server
 *   contract for idempotency and an app-owned queue.
 * - **Errors get a real summary**: a focusable list at the top of the form with
 *   in-page links to each bad field. This is the pattern screen reader and
 *   keyboard users actually navigate by, and the one WCAG 3.3.1 is asking for.
 * - **Double submits are blocked** while a request is in flight — the single
 *   most common cause of duplicate orders on a slow connection.
 */
export function ResilientForm({
  formKey,
  onSubmit,
  errors,
  labels: labelOverrides,
  persistDraft = true,
  onSubmissionStateChange,
  children,
  className,
  ...props
}: ResilientFormProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { online } = useNetwork();
  const { direction } = useLocale();

  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  const summaryId = useId();
  const errorEntries = Object.entries(errors ?? {});
  // A stable identity for "which errors are showing", so focus is stolen when
  // the error set genuinely changes and not on every unrelated re-render.
  const errorSignature = errorEntries.map(([name]) => name).join("|");

  const setState = useCallback(
    (state: SubmissionState) => {
      setSubmissionState(state);
      onSubmissionStateChange?.(state);
    },
    [onSubmissionStateChange],
  );

  // Restore any saved draft once, after hydration. Doing this during render
  // would produce markup the server never sent.
  useEffect(() => {
    if (!persistDraft) return;

    const form = formRef.current;
    const draft = loadDraft(formKey);
    if (!form || !draft) return;

    if (applyDraft(form, draft).length > 0) {
      setRestored(true);
      setState("draft-restored");
      announce(labels.draftRestored, "polite");
    }
  }, [formKey, persistDraft, labels.draftRestored, setState]);

  const persist = useCallback(() => {
    const form = formRef.current;
    if (!form || !persistDraft) return;

    saveDraft(formKey, readForm(form));
  }, [formKey, persistDraft]);

  const send = useCallback(
    async (data: FormData) => {
      setSubmitting(true);
      setState("sending");
      try {
        await onSubmit(data);

        clearDraft(formKey);
        setRestored(false);
        setState("sent");
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, formKey, setState],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const data = new FormData(event.currentTarget);

    if (!online) {
      persist();
      setState("saved-offline");
      announce(labels.savedOffline, "assertive");
      return;
    }

    void send(data).catch(() => {
      // A browser timeout cannot tell us whether the server processed the
      // request. Keep the draft and ask the product to reconcile it first.
      persist();
      setState("needs-attention");
      announce(labels.needsAttention, "assertive");
    });
  };

  // Move focus to the summary whenever a new set of errors arrives, so the next
  // thing the user hears is what went wrong.
  useEffect(() => {
    if (errorSignature) summaryRef.current?.focus();
  }, [errorSignature]);

  return (
    <form
      {...props}
      ref={formRef}
      dir={direction}
      noValidate
      onSubmit={handleSubmit}
      onInput={persist}
      className={cn("flex flex-col gap-4 text-start", className)}
    >
      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={summaryId}
          className="rounded-lg border border-red-300 bg-red-50 p-4 outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-red-900 dark:bg-red-950/50"
        >
          <h2 id={summaryId} className="text-sm font-semibold text-red-900 dark:text-red-100">
            {labels.errorSummary(errorEntries.length)}
          </h2>

          <ul className="mt-2 flex list-disc flex-col gap-1 ps-5 text-sm">
            {errorEntries.map(([name, message]) => (
              <li key={name}>
                <a
                  href={`#${name}`}
                  onClick={(event) => {
                    // The field's DOM id is generated by useId, so resolve the
                    // target by name and focus it directly.
                    event.preventDefault();
                    const field = formRef.current?.elements.namedItem(name);
                    (field as HTMLElement | null)?.focus();
                  }}
                  className="text-red-900 underline underline-offset-2 dark:text-red-100"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {restored && (
        <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:bg-blue-950/50 dark:text-blue-100">
          {labels.draftRestored}
        </p>
      )}

      {submissionState === "saved-offline" && (
        <p role="status" className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
          {labels.savedOffline}
        </p>
      )}

      {submissionState === "needs-attention" && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-900 dark:bg-red-950/50 dark:text-red-100">
          {labels.needsAttention}
        </p>
      )}

      <fieldset disabled={submitting} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
