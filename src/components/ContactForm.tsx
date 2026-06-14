"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { track } from "@/lib/analytics";

const QUAL_TO_LEVEL: Record<string, string> = {
  "12th": "plus_two",
  graduate: "degree",
  postgraduate: "pg",
};

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const fd = new FormData(e.currentTarget);
    const course = fd.get("course") as string;
    const qual = fd.get("qualification") as string;
    const message = fd.get("message") as string;

    const noteParts: string[] = [];
    if (course) noteParts.push(`Interested in: ${course}`);
    if (qual) noteParts.push(`Qualification: ${qual}`);
    if (message.trim()) noteParts.push(message.trim());

    try {
      const res = await fetch("/api/lead-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email") || undefined,
          programLevel: QUAL_TO_LEVEL[qual] || undefined,
          notes: noteParts.join(" | ") || undefined,
          source: "contact_form",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      track("lead_submit", { source: "contact_form" });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#E5E5EA] shadow-sm h-full flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-[#1D1D1F] text-xl mb-2">Enquiry Received!</h3>
        <p className="text-[#6E6E73] text-sm">Our admissions team will contact you within 2 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#E5E5EA] shadow-sm h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1D1D1F]">Send an Enquiry</h2>
          <p className="text-[#6E6E73] text-xs">We respond within 2 hours on business days.</p>
        </div>
      </div>

      <div className="section-divider my-5" />

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">
              Full Name <span className="text-[#EC4899]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input-field"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">
              Phone / WhatsApp <span className="text-[#EC4899]">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="input-field"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="course" className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">
            Interested Program
          </label>
          <select id="course" name="course" className="input-field">
            <option value="">Select a program...</option>
            <option value="admissions">University Admissions (UG / PG / MBA)</option>
            <option value="montessori">Montessori Counseling &amp; Training</option>
            <option value="other">Other / Not Sure</option>
          </select>
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">
            Current Qualification
          </label>
          <select id="qualification" name="qualification" className="input-field">
            <option value="">Select your qualification...</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th / +2 Pass</option>
            <option value="graduate">Graduate (UG)</option>
            <option value="postgraduate">Post Graduate (PG)</option>
            <option value="working">Working Professional</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">
            Tell us your goals
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="input-field resize-none"
            placeholder="What are you looking to achieve? Any specific course or university in mind?"
          />
        </div>

        {status === "error" && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <div className="flex items-start gap-2.5 p-4 bg-[#F5F3FF] rounded-xl border border-[#E0E7FF]">
          <Lock className="w-5 h-5 text-[#4F46E5] shrink-0" />
          <p className="text-xs text-[#6E6E73] leading-relaxed">
            Your information is 100% confidential. We never share your data with third parties.
            By submitting, you agree to our{" "}
            <Link href="/privacy-policy" className="text-[#4F46E5] underline">Privacy Policy</Link>.
          </p>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full btn-gradient-vivid text-white font-bold py-4 rounded-xl btn-press shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : (
            <>
              Submit Enquiry — It&apos;s Free
              <svg className="w-5 h-5 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
