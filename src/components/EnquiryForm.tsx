"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Props = {
  source?: string;
  universityId?: string;
  courseId?: string;
  /** Pre-filled context shown in the heading, e.g. course name. */
  context?: string;
  compact?: boolean;
  /** Override the submit button label. */
  submitLabel?: string;
  /** Override the success state heading. */
  successTitle?: string;
  /** Override the success state body copy. */
  successMessage?: string;
  /** Fired once after a successful submission (e.g. to raise a toast). */
  onSuccess?: () => void;
};

/**
 * Lead-capture enquiry form. Posts to /api/leads, which links the submission to
 * the anonymous visitor cookie — turning "who visited" into a named lead.
 */
export default function EnquiryForm({
  source = "enquiry_form",
  universityId,
  courseId,
  context,
  compact,
  submitLabel,
  successTitle,
  successMessage,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const fd = new FormData(e.currentTarget);
    const sp =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          message: fd.get("message"),
          source,
          universityId,
          courseId,
          utm_source: sp.get("utm_source") || undefined,
          utm_medium: sp.get("utm_medium") || undefined,
          utm_campaign: sp.get("utm_campaign") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      track("lead_submit", { source, context: context ?? "" });
      setStatus("done");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
        <p className="font-semibold text-green-800">{successTitle ?? "Thank you! 🎉"}</p>
        <p className="text-sm text-green-700 mt-1">
          {successMessage ??
            `Our admissions team will call you shortly${context ? ` about ${context}` : ""}.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {context && !compact && (
        <p className="text-sm text-gray-500">
          Get fee details & eligibility for <strong>{context}</strong>.
        </p>
      )}
      <input
        name="name"
        placeholder="Your name"
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="phone"
        type="tel"
        required
        placeholder="Phone number *"
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {!compact && (
        <>
          <input
            name="email"
            type="email"
            placeholder="Email (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            rows={2}
            placeholder="Your question (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      )}
      {status === "error" && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 transition-colors"
      >
        {status === "loading" ? "Submitting…" : submitLabel ?? "Get Free Counselling"}
      </button>
    </form>
  );
}
