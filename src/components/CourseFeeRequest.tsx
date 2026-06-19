"use client";

import { useEffect, useState } from "react";
import { IndianRupee, CheckCircle2, X, Lock } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";

type Props = {
  universityId?: string;
  courseId?: string;
  /** Course + university label, e.g. "BBA ACCA at Amrita University". */
  context: string;
};

/**
 * Fee details are intentionally never shown on the public site — pricing is kept
 * internal so every fee enquiry becomes a captured lead. This card invites the
 * visitor to request the fee, reveals the lead form on click, and confirms with
 * a toast that the team will message them the full pricing.
 */
export default function CourseFeeRequest({ universityId, courseId, context }: Props) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#ECE9FB] bg-white shadow-[0_4px_20px_rgba(79,70,229,0.08)]">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-5 py-5 text-white">
        <div className="dot-pattern absolute inset-0 opacity-10" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <IndianRupee className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-bold leading-tight">Course Fee &amp; Scholarships</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <Lock className="h-3 w-3" />
              Personalised pricing — get the latest fee &amp; offers
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {!open ? (
          <>
            <ul className="mb-4 space-y-2 text-sm text-[#3A3A3C]">
              {[
                "Full fee breakdown & EMI options",
                "Live scholarship & early-bird discounts",
                "Free expert counselling — zero obligation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Request to See Course Fee
            </button>
            <div className="mt-2">
              <WhatsAppButton context={context} />
            </div>
          </>
        ) : (
          <>
            <p className="mb-3 text-sm text-[#6E6E73]">
              Enter your details and we&apos;ll send you the complete fee structure for{" "}
              <strong className="text-[#1D1D1F]">{context}</strong>.
            </p>
            <EnquiryForm
              source="course_fee_request"
              universityId={universityId}
              courseId={courseId}
              context={context}
              compact
              submitLabel="Send Me the Fee Details"
              successTitle="Request received! 🎉"
              successMessage="You'll get a message shortly with the full fee details, scholarships and admission steps."
              onSuccess={() => setToast(true)}
            />
            <div className="mt-2">
              <WhatsAppButton context={context} />
            </div>
          </>
        )}
      </div>

      {/* Success toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-[#D9F5E6] bg-white p-4 shadow-[0_10px_40px_rgba(16,185,129,0.25)] animate-[slideup_0.3s_ease-out]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="pr-4">
            <p className="text-sm font-bold text-[#1D1D1F]">Thanks! Request received</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#6E6E73]">
              You&apos;ll receive a message with the full fee details &amp; pricing shortly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(false)}
            className="absolute right-2 top-2 text-[#AEAEB2] transition-colors hover:text-[#6E6E73]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
