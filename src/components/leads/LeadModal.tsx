"use client";

import { useEffect, useRef, useState } from "react";

export type LeadModalResult = { ok: true } | { ok: false; error: string };

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  withEmail?: boolean;
  onSubmit: (values: {
    name: string;
    phone: string;
    email?: string;
  }) => Promise<LeadModalResult>;
  /** Called after a successful submission (e.g. unlock fees) */
  onSuccess?: () => void;
}

export default function LeadModal({
  open,
  onClose,
  title,
  subtitle,
  submitLabel,
  successTitle,
  successMessage,
  withEmail = false,
  onSubmit,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setTimeout(() => nameRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({
        name,
        phone,
        email: email || undefined,
      });
      if (result.ok) {
        setDone(true);
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E5E5EA] flex items-center justify-center text-lg"
          aria-label="Close"
        >
          ×
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#E8F9EF] text-[#0d9455] text-2xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">
              {successTitle}
            </h3>
            <p className="text-sm text-[#6E6E73] mb-6">{successMessage}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-colors btn-press"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-1 pr-8">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-[#6E6E73] mb-5">{subtitle}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Mobile number (WhatsApp)"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]"
              />
              {withEmail && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]"
                />
              )}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#007AFF] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0066D6] disabled:opacity-60 transition-colors shadow-md shadow-[#007AFF]/20 btn-press"
              >
                {submitting ? "Please wait…" : submitLabel}
              </button>
              <p className="text-[0.68rem] text-[#AEAEB2] text-center leading-relaxed">
                Our admission counsellor may contact you on this number. No
                spam, ever.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
